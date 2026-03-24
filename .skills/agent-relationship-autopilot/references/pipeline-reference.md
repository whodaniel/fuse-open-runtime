# Pipeline Reference

## Primary Files

- `/Users/danielgoldberg/rebuild_agent_relationship_artifacts.sh`
- `/Users/danielgoldberg/Makefile`
- `/Users/danielgoldberg/agent-relationship-subgraphs-index.md`

## Output Groups

- Core graph: `agent-relationship-graph.json`, `.md`, `.cypher`
- Domain subgraphs: `agent-relationship-<domain>-subgraph.{json,md,noapoc.cypher,html}`
- Analytics: `agent-relationship-centrality-report.{md,json}`
- Neo4j package: `agent-relationship-neo4j-package/*`
- Temporal: `agent-relationship-snapshots/*`

## Commands

```bash
cd /Users/danielgoldberg
make graph-all
make graph-subgraphs
make graph-analytics
make graph-neo4j
make graph-temporal
make graph-alerts
```

## Scheduler Commands

```bash
# Cron install/remove/show
./setup_graph_snapshot_cron.sh install "0 * * * *"
./setup_graph_snapshot_cron.sh show
./setup_graph_snapshot_cron.sh remove

# launchd install/status/remove
./setup_graph_snapshot_launchd.sh install 3600
./setup_graph_snapshot_launchd.sh status
./setup_graph_snapshot_launchd.sh remove
```
