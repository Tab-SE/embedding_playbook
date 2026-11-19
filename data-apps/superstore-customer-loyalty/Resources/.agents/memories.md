# Decisions
- ebike and Customers/Retention_Churn datasources were rejected: they do not match the Superstore
  story (Retention_Churn is actually budget data despite its description).
- Superstore has no loyalty fields, so tiers are computed (RFM-style), not read from the data.
