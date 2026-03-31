// src/components/views/CognateGraph.tsx
// D3.js force-directed graph for cognate relationships across all 13 languages

import { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
import { Box, Typography, Stack, Chip, alpha } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { LANGS, FAMILY_COLORS, COGNATE_TREES } from '@/constants/languages'
import type { Entry, LangCode } from '@/types'

interface GraphNode extends d3.SimulationNodeDatum {
  id: string
  label: string
  type: 'root' | 'lang' | 'concept'
  family?: string
  langCode?: LangCode
  group: string   // cognate group key
  r: number       // radius
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode
  target: string | GraphNode
  strength: number
}

interface Props {
  entries: Entry[]
}

function buildGraph(entries: Entry[]): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  const nodeIds = new Set<string>()

  const addNode = (node: GraphNode) => {
    if (!nodeIds.has(node.id)) {
      nodes.push(node)
      nodeIds.add(node.id)
    }
  }

  // Get all cognate groups from entries
  const groupedEntries = entries.filter(e => e.cognateGroup)
  const groups = [...new Set(groupedEntries.map(e => e.cognateGroup))]

  groups.forEach(group => {
    const tree = COGNATE_TREES[group]
    if (!tree) return

    // Root node (Latin/Proto form)
    const rootId = `root__${group}`
    addNode({ id: rootId, label: tree.root, type: 'root', group, r: 22 })

    // For each entry in this group, add language nodes
    const groupEntries = entries.filter(e => e.cognateGroup === group)
    groupEntries.forEach(entry => {
      LANGS.forEach(lang => {
        const t = entry.translations?.[lang.code]
        if (!t?.value) return

        const langNodeId = `lang__${group}__${lang.code}`
        const existing = nodes.find(n => n.id === langNodeId)

        if (!existing) {
          addNode({
            id: langNodeId,
            label: `${lang.flag} ${t.value}`,
            type: 'lang',
            family: lang.family,
            langCode: lang.code,
            group,
            r: 16,
          })

          // Link to root
          links.push({
            source: rootId,
            target: langNodeId,
            strength: lang.family === 'roman' ? 0.8 : 0.4,
          })
        }

        // Cross-group cognate links (same family)
        LANGS.filter(l2 => l2.family === lang.family && l2.code !== lang.code).forEach(l2 => {
          const t2 = entry.translations?.[l2.code]
          if (!t2?.value) return
          const otherId = `lang__${group}__${l2.code}`
          const linkExists = links.some(
            lk => (lk.source === langNodeId && lk.target === otherId) ||
                  (lk.source === otherId && lk.target === langNodeId)
          )
          if (!linkExists) {
            links.push({ source: langNodeId, target: otherId, strength: 0.15 })
          }
        })
      })
    })
  })

  return { nodes, links }
}

export default function CognateGraph({ entries }: Props) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const svgRef = useRef<SVGSVGElement>(null)
  const simRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null)

  const { nodes, links } = useMemo(() => buildGraph(entries), [entries])

  const groups = [...new Set(entries.filter(e => e.cognateGroup).map(e => e.cognateGroup))]

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const W = svgRef.current.clientWidth  || 700
    const H = svgRef.current.clientHeight || 480

    // Zoom layer
    const g = svg.append('g')

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => g.attr('transform', event.transform))
    )

    // Colors
    const famColor = (family?: string) => {
      if (!family) return theme.palette.primary.main
      return FAMILY_COLORS[family as keyof typeof FAMILY_COLORS]?.main ?? '#999'
    }

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(d => d.strength > 0.5 ? 90 : 140)
        .strength(d => d.strength)
      )
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.r + 10))
      .force('x', d3.forceX(W / 2).strength(0.04))
      .force('y', d3.forceY(H / 2).strength(0.04))

    simRef.current = simulation

    // Defs — arrowhead
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22).attr('refY', 0)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', isDark ? '#666' : '#bbb')
      .attr('d', 'M0,-5L10,0L0,5')

    // Links
    const link = g.append('g')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => d.strength > 0.4
        ? alpha(theme.palette.primary.main, 0.5)
        : alpha(isDark ? '#888' : '#ccc', 0.6)
      )
      .attr('stroke-width', d => d.strength > 0.4 ? 2 : 1)
      .attr('stroke-dasharray', d => d.strength < 0.2 ? '4,4' : 'none')

    // Node groups
    const node = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'grab')
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null; d.fy = null
          })
      )

    // Root nodes — diamond shape
    node.filter(d => d.type === 'root')
      .append('rect')
      .attr('width', d => d.r * 2.2)
      .attr('height', d => d.r * 2.2)
      .attr('x', d => -d.r * 1.1)
      .attr('y', d => -d.r * 1.1)
      .attr('rx', 6)
      .attr('fill', theme.palette.primary.main)
      .attr('stroke', isDark ? '#fff' : '#fff')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))')

    // Lang nodes — circles
    node.filter(d => d.type === 'lang')
      .append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => alpha(famColor(d.family), isDark ? 0.35 : 0.2))
      .attr('stroke', d => famColor(d.family))
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 1px 4px rgba(0,0,0,0.15))')

    // Hover highlight
    node
      .on('mouseover', function(_, d) {
        d3.select(this).select('circle, rect')
          .transition().duration(150)
          .attr('fill', d.type === 'root'
            ? alpha(theme.palette.primary.main, 0.85)
            : alpha(famColor(d.family), 0.55)
          )
      })
      .on('mouseout', function(_, d) {
        d3.select(this).select('circle')
          .transition().duration(200)
          .attr('fill', alpha(famColor(d.family), isDark ? 0.35 : 0.2))
        d3.select(this).select('rect')
          .transition().duration(200)
          .attr('fill', theme.palette.primary.main)
      })

    // Labels
    node.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.type === 'root' ? '0.35em' : d.r + 14)
      .attr('font-size', d => d.type === 'root' ? '11px' : '10px')
      .attr('font-weight', d => d.type === 'root' ? '700' : '500')
      .attr('font-family', 'Nunito, sans-serif')
      .attr('fill', d => d.type === 'root'
        ? '#fff'
        : (isDark ? theme.palette.text.primary : theme.palette.text.primary)
      )
      .attr('pointer-events', 'none')

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0)

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    return () => { simulation.stop() }
  }, [nodes, links, theme, isDark])

  if (nodes.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1.5, p: 4 }}>
        <Typography variant="headlineSmall">🔗</Typography>
        <Typography variant="bodyMedium" color="text.secondary">
          Cognate grubu olan kavram bulunamadı.
        </Typography>
        <Typography variant="bodySmall" color="text.secondary">
          Kavram eklerken "Cognate grubu" alanını doldurun.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Legend */}
      <Box sx={{ px: 2, py: 1.25, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="labelSmall" color="text.secondary">Cognate grupları:</Typography>
          {groups.map(g => (
            <Chip key={g} label={g} size="small"
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.12), color: theme.palette.primary.main, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
          ))}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            {Object.entries(FAMILY_COLORS).map(([family, { main, label }]) => (
              <Stack key={family} direction="row" alignItems="center" gap={0.5}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: main }} />
                <Typography variant="labelSmall" sx={{ color: main, fontSize: '0.65rem' }}>{label}</Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
        <Typography variant="bodySmall" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.65rem' }}>
          ■ = Köken (Latince) · ● = Dil formu · Sürükle &amp; yaklaştır/uzaklaştır
        </Typography>
      </Box>

      {/* Graph */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: isDark ? alpha('#1C1B1F', 0.5) : alpha('#F6F2FF', 0.4) }}>
        <svg
          ref={svgRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </Box>
    </Box>
  )
}
