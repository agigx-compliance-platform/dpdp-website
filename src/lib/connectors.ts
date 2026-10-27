/**
 * Connector inventory for the marketing site.
 * Live types and types that can be added later are listed separately.
 */

export type ConnectorCategory = {
  id: string
  label: string
  items: string[]
}

export const CONNECTOR_CATEGORIES: ConnectorCategory[] = [
  {
    id: 'rdbms',
    label: 'Relational databases',
    items: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server'],
  },
  {
    id: 'warehouse',
    label: 'Warehouses and catalogs',
    items: ['Snowflake', 'BigQuery', 'Amazon Redshift', 'AWS Glue', 'Unity Catalog', 'Amazon DataZone'],
  },
  {
    id: 'nosql',
    label: 'NoSQL and search',
    items: ['MongoDB', 'DynamoDB', 'Azure Cosmos DB', 'Elasticsearch', 'Redis'],
  },
  {
    id: 'storage',
    label: 'Object storage',
    items: ['Amazon S3', 'Google Cloud Storage', 'Azure Blob Storage', 'Azure Data Lake Gen2'],
  },
  {
    id: 'streaming',
    label: 'Streaming',
    items: ['Apache Kafka'],
  },
  {
    id: 'saas',
    label: 'SaaS',
    items: [
      'Salesforce',
      'ServiceNow',
      'Workday',
      'SharePoint',
      'SAP',
      'Zendesk',
      'HubSpot',
      'Zoho CRM',
      'Freshdesk',
      'Razorpay',
      'Google Drive',
      'OneDrive',
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud inventory',
    items: ['AWS', 'Azure', 'GCP', 'Kubernetes'],
  },
  {
    id: 'logs',
    label: 'Logs and audit',
    items: [
      'CloudWatch Logs',
      'CloudTrail',
      'Azure Log Analytics',
      'Azure Activity Log',
      'GCP Cloud Logging',
      'GCP Audit Logs',
    ],
  },
  {
    id: 'backup',
    label: 'Backup vaults',
    items: ['AWS Backup', 'Azure Recovery Services', 'GCP Backup'],
  },
  {
    id: 'lineage',
    label: 'Lineage sources',
    items: ['dbt', 'OpenLineage'],
  },
]

/** Systems that can be added to an estate. Not claimed as live today. */
export const FUTURE_CONNECTOR_CATEGORIES: ConnectorCategory[] = [
  {
    id: 'rdbms-more',
    label: 'More databases',
    items: ['MariaDB', 'IBM Db2', 'Azure SQL', 'Azure Synapse', 'Teradata', 'ClickHouse', 'Apache Hive'],
  },
  {
    id: 'warehouse-more',
    label: 'More warehouses and lakes',
    items: ['Databricks', 'Amazon Athena', 'Google Cloud SQL', 'Trino', 'Apache Iceberg catalogs'],
  },
  {
    id: 'nosql-more',
    label: 'More operational stores',
    items: ['Cassandra', 'Couchbase', 'Neo4j', 'Firebase', 'Supabase'],
  },
  {
    id: 'storage-more',
    label: 'More object and file stores',
    items: ['MinIO', 'Box'],
  },
  {
    id: 'streaming-more',
    label: 'More streams',
    items: ['Amazon Kinesis', 'Azure Event Hubs', 'Google Pub/Sub', 'Apache Pulsar'],
  },
  {
    id: 'saas-more',
    label: 'More SaaS',
    items: ['Shopify', 'Intercom', 'Jira', 'Confluence', 'Slack', 'Microsoft Dynamics', 'Oracle Fusion'],
  },
]

export const CONNECTOR_TYPE_COUNT = CONNECTOR_CATEGORIES.reduce(
  (sum, cat) => sum + cat.items.length,
  0,
)

export const FUTURE_CONNECTOR_COUNT = FUTURE_CONNECTOR_CATEGORIES.reduce(
  (sum, cat) => sum + cat.items.length,
  0,
)

/** File stem under /images/connectors/{stem}.svg. Unmapped names use a letter mark. */
export const CONNECTOR_MARK: Record<string, string> = {
  PostgreSQL: 'postgresql',
  MySQL: 'mysql',
  Oracle: 'oracle',
  'SQL Server': 'microsoftsqlserver',
  Snowflake: 'snowflake',
  BigQuery: 'googlebigquery',
  'AWS Glue': 'amazonaws',
  'Unity Catalog': 'databricks',
  'Amazon DataZone': 'amazonaws',
  MongoDB: 'mongodb',
  DynamoDB: 'amazondynamodb',
  'Azure Cosmos DB': 'microsoftazure',
  Elasticsearch: 'elasticsearch',
  Redis: 'redis',
  'Amazon S3': 'amazons3',
  'Apache Kafka': 'apachekafka',
  Salesforce: 'salesforce',
  SharePoint: 'microsoftsharepoint',
  SAP: 'sap',
  Zendesk: 'zendesk',
  AWS: 'amazonaws',
  Azure: 'microsoftazure',
  GCP: 'googlecloud',
  Kubernetes: 'kubernetes',
  'CloudWatch Logs': 'amazoncloudwatch',
  CloudTrail: 'amazonaws',
  'Azure Log Analytics': 'microsoftazure',
  'Azure Activity Log': 'microsoftazure',
  'GCP Cloud Logging': 'googlecloud',
  'GCP Audit Logs': 'googlecloud',
  'AWS Backup': 'amazonaws',
  'Azure Recovery Services': 'microsoftazure',
  'GCP Backup': 'googlecloud',
  MariaDB: 'mariadb',
  'IBM Db2': 'ibm',
  'Azure SQL': 'azuresqldatabase',
  'Amazon Redshift': 'amazonaws',
  'Azure Synapse': 'microsoftazure',
  Databricks: 'databricks',
  'Amazon Athena': 'amazonaws',
  'Google Cloud SQL': 'googlecloud',
  Firebase: 'firebase',
  Cassandra: 'apachecassandra',
  Neo4j: 'neo4j',
  HubSpot: 'hubspot',
  Shopify: 'shopify',
  Slack: 'slack',
  Jira: 'jira',
  Confluence: 'confluence',
  'Azure Blob Storage': 'microsoftazure',
  'Google Cloud Storage': 'googlecloud',
  'Azure Data Lake Gen2': 'microsoftazure',
  'Google Drive': 'google',
  OneDrive: 'microsoft',
  'Amazon Kinesis': 'amazonaws',
  'Azure Event Hubs': 'microsoftazure',
  'Google Pub/Sub': 'googlecloud',
  'Microsoft Dynamics': 'microsoft',
  'Oracle Fusion': 'oracle',
}
