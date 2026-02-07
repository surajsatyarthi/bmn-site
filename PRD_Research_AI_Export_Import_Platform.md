# PRD Research: AI-Powered Export-Import "Done For You" Service Platform

---

## 1. Key Pain Points for SME Exporters and Importers

### 1.1 Finding Buyers / Sellers (Discovery Problem)

The single largest challenge for SME exporters is **finding foreign customers and identifying foreign markets**. According to the U.S. Small Business Administration, **54% of small businesses** report difficulty finding foreign customers as their largest challenge in growing foreign operations. SMEs lack the networks, trade show budgets, and brand recognition that large enterprises leverage. They rely on word-of-mouth, sporadic trade fair attendance, and directory listings that produce low-quality leads.

### 1.2 Trade Finance & Payment Risk

Access to finance is the single biggest hurdle MSMEs face in global integration. **Over half of trade finance requests by SMEs are rejected globally**, compared to just 7% for multinational companies. SMEs struggle to secure trade finance due to limited credit histories in foreign markets and lack of substantial collateral. Payment risk (will the buyer pay? will the seller ship?) remains a core anxiety, especially in new relationships.

### 1.3 Regulatory & Compliance Complexity

SMEs face a uniquely hostile regulatory environment:
- **60+ different documents** may be required per overseas shipment, traded across partners, countries, languages, and time zones.
- Navigating varying trade laws, customs requirements, and product standards across countries is complex and leads to costly delays.
- **40% of small businesses** cite "navigating foreign import rules" as a top challenge.
- Rapid policy changes (tariff escalation, de minimis threshold elimination, export control shifts) create unpredictability. Companies must constantly reassess classification, valuation, and country-of-origin determinations.

### 1.4 Lack of Export Knowledge & Skilled Personnel

SMEs tend to lack qualified and experienced personnel for:
- Identifying, selecting, and obtaining information on external markets
- Designing and implementing marketing strategies for foreign markets
- Developing and negotiating contracts overseas
- Managing documentation, billing, foreign language communication, and logistics

### 1.5 Documentation Burden

A typical overseas purchase requires hundreds of document exchanges per shipment. Key documents include shipping bills, bills of lading, commercial invoices, packing lists, certificates of origin, insurance certificates, and various compliance certificates. Errors in documentation cause shipment delays, customs holds, and financial penalties.

### 1.6 Logistics & Supply Chain Complexity

Cross-border logistics involves coordinating freight forwarding, customs brokerage, warehousing, last-mile delivery, and insurance across jurisdictions. SMEs lack the volume to negotiate favorable shipping rates and often lack visibility into shipment status.

### 1.7 Tariff Uncertainty & Geopolitical Risk

The 2025-2026 trade environment is marked by rapid tariff changes (IEEPA tariffs, reciprocal rates), shifting sanctions regimes, and supply chain pressures. SMEs lack the trade intelligence infrastructure to track and respond to these changes in real-time.

### 1.8 Standards & Certification Barriers

Products must meet destination-country standards (BIS for India, CE for Europe, FDA for US, etc.). Obtaining and maintaining these certifications is expensive and time-consuming, particularly for SMEs with limited product lines.

**Key Takeaway for PRD:** An AI-powered platform must address the discovery problem (finding counterparties), the knowledge gap (compliance, documentation, regulations), the trust gap (verification, payment security), and the execution gap (end-to-end logistics and documentation management).

---

## 2. Existing Platforms: What They Do and Their Limitations

### 2.1 IndiaMART

**What it does:**
- India's largest online B2B marketplace, connecting ~6.9 million suppliers with 98+ million registered buyers.
- Primarily a directory/listing platform where suppliers create product catalogs and buyers send inquiries.
- Offers paid "TrustSEAL" and "Star Supplier" badges for premium visibility.
- Revenue model: subscription fees from suppliers (Silver, Gold, Platinum plans).

**Limitations:**
- **Functions solely as a directory** -- no order placement, no checkout, no cart functionality.
- **Minimal verification** -- scammers can pay for verified badges; limited background checks on suppliers.
- **Fake/low-quality leads** -- sellers report receiving spam inquiries and no genuine leads after paying for premium listings. Trustpilot rating of 1.6/5 stars.
- **No transaction facilitation** -- no escrow, no trade assurance, no logistics integration.
- **Outdated product information** -- listings are often stale and not maintained.
- **Primarily domestic** -- strong within India but limited international buyer reach.
- **No trade intelligence** -- no HS code mapping, no customs data, no compliance guidance.

### 2.2 Alibaba.com

**What it does:**
- World's largest B2B e-commerce platform with massive global reach.
- Trade Assurance program for safer transactions (payment protection).
- Supplier verification programs, RFQ tools, and built-in messaging.
- Integrated logistics solutions and payment processing.

**Limitations:**
- **Extremely high competition** -- millions of suppliers, making it hard for SMEs to stand out.
- **Costly premium plans** -- meaningful visibility requires significant advertising spend.
- **Supplier identity fraud** -- 42% of cross-border trade disputes originated from supplier identity fraud (2023 China Consumer Association report).
- **China-centric** -- heavily weighted toward Chinese manufacturers; limited support for Indian or other-country exporters.
- **Generic matching** -- no intelligent buyer-seller matching based on trade data or compatibility signals.
- **No "done for you" service** -- buyers and sellers must manage compliance, shipping, and documentation themselves.

### 2.3 TradeIndia

**What it does:**
- One of India's oldest B2B portals connecting manufacturers, suppliers, and exporters.
- Offers premium listings, catalogs, and buyer-seller connect features.
- Strong in domestic trade with marketing tools for sellers.

**Limitations:**
- **Lower international visibility** than IndiaMART or Alibaba.
- **Fake inquiries and fake traffic** -- widely reported by sellers.
- **No post-payment support** -- users report no support after paying subscription fees.
- **No transaction or logistics layer** -- purely a directory.

### 2.4 ExportGenius

**What it does:**
- Trade intelligence platform providing import-export customs data.
- Covers 190+ countries with import-export trade data, 55+ countries with detailed customs data.
- Offers AI-based data visualizations, tree maps for business relationships.
- Users can search by HS code, product description, company name, or country.

**Limitations:**
- **Credit-based pricing model** complicates data access and downloads.
- **Monthly plans offer only 3 months of historical data access.**
- **Data only, no matchmaking** -- provides raw trade intelligence but does not facilitate introductions or transactions.
- **No compliance or documentation support.**
- **Steep learning curve** for SMEs unfamiliar with trade data analysis.

### 2.5 ImportGenius

**What it does:**
- U.S.-focused trade data platform providing bill-of-lading level customs records.
- Tracks 258M+ import shipments and 5.6M+ export shipments.
- AI-powered search for company profiles, supplier verification, and shipment alerts.
- Full US import history since 2006, export history since 2014.

**Limitations:**
- **Heavily US-centric** -- strongest data coverage is for US trade; other countries have less depth.
- **Expensive for SMEs** -- pricing is designed for enterprise users.
- **Data-only platform** -- no matchmaking, no transaction facilitation, no compliance support.
- **Requires trade data literacy** to extract actionable insights.

### 2.6 Kompass

**What it does:**
- Global B2B directory connecting 60M+ verified companies across 70+ countries.
- Products include EasyBusiness (B2B lead prospecting) and ByPath (business intelligence via big data).
- Detailed company classification using its own product/service taxonomy.

**Limitations:**
- **Pricing is opaque** -- not publicly listed.
- **Basic listings are free but limited** -- meaningful access requires paid subscription or credits.
- **Directory model** -- no trade facilitation, no logistics, no compliance tools.
- **Outdated company data** in many regions.

### 2.7 Gap Analysis: What No Platform Does Today

| Capability | IndiaMART | Alibaba | TradeIndia | ExportGenius | ImportGenius | Kompass |
|---|---|---|---|---|---|---|
| Buyer-Seller Discovery | Partial | Yes | Partial | Data only | Data only | Directory |
| Intelligent Matching (AI) | No | No | No | No | No | No |
| Trade Data Intelligence | No | No | No | Yes | Yes | Partial |
| Compliance/Documentation | No | No | No | No | No | No |
| Transaction Facilitation | No | Partial | No | No | No | No |
| Logistics Integration | No | Partial | No | No | No | No |
| Cold Outreach Automation | No | No | No | No | No | No |
| End-to-End "Done for You" | No | No | No | No | No | No |

**The market opportunity is clear:** No existing platform combines trade intelligence + AI-powered matching + compliance automation + outreach automation + transaction facilitation into a single "done for you" service.

---

## 3. Exporter/Importer Profile: Required Information

### 3.1 Core Business Identity

| Field | Description | Why It Matters |
|---|---|---|
| **Company Name & Legal Entity Type** | Proprietorship, Partnership, LLP, Pvt Ltd, etc. | Determines compliance requirements and liability structure |
| **IEC Number** | 10-digit Importer-Exporter Code issued by DGFT (lifetime validity) | Mandatory for any import/export activity in India; required for customs clearance |
| **PAN** | Permanent Account Number | Required for IEC application; tax identification |
| **GST Number** | Goods & Services Tax Identification | Domestic tax compliance, input credit for exports |
| **Registered Address & Factory/Warehouse Addresses** | Physical locations of operations | Determines jurisdiction, inspection requirements |
| **Bank Account Details** | Current account in firm's name | Required for IEC; used for foreign exchange transactions |
| **Authorized Signatories** | Directors, partners, or proprietor details | For document execution and customs declarations |

### 3.2 Trade-Specific Registrations

| Registration | Description |
|---|---|
| **RCMC (Registration Cum Membership Certificate)** | Validates the exporter as a member of the relevant Export Promotion Council (EPC), Commodity Board, or Development Authority. Valid for 5 years. Required for availing export incentives, duty drawback, and government schemes. India has 27 EPCs, 6 Commodity Boards, and 2 Development Authorities. |
| **AD Code Registration** | Authorized Dealer code registered with the customs port for foreign exchange transactions. |
| **Digital Signature Certificate (DSC)** | For filing electronic documents with DGFT, customs, and other agencies. |
| **Letter of Undertaking (LUT)** | Filed annually with GST authorities for zero-rated exports without payment of IGST. |

### 3.3 Product & Classification Data

| Field | Description |
|---|---|
| **HS Codes (ITC-HS Codes)** | 8-digit product classification codes for each product being exported/imported. Determines duty rates, regulatory requirements, and eligibility for trade agreements. |
| **Product Descriptions** | Detailed descriptions matching HS code classifications. |
| **Product Categories / Sectors** | Broad industry classification (agriculture, textiles, chemicals, engineering goods, etc.) |
| **Annual Export/Import Volume** | Quantity and value of trade, by product and by destination/origin country. |
| **Past Export Performance** | Historical trade data captured in the DGFT profile (ANF-1). |

### 3.4 Quality & Compliance Certifications

| Certificate | Applicability |
|---|---|
| **ISO 9001 (Quality Management)** | General quality management; not mandatory but expected by international buyers. |
| **ISO 22000 (Food Safety Management)** | Required by many large buyers and export markets for food products. |
| **ISO 14001 (Environmental Management)** | Increasingly required for sustainability-conscious buyers. |
| **FSSAI License/Registration** | Mandatory for all food businesses in India. Central License required for food exporters. |
| **BIS (Bureau of Indian Standards) Certification** | Mandatory for specific product categories (construction, electronics, chemicals). ISI mark. |
| **APEDA Registration** | Required for agricultural and processed food exporters (under APEDA's jurisdiction). |
| **MPEDA Registration** | Required for marine product exporters. |
| **Spice Board / Coffee Board / Rubber Board / Tea Board Registration** | Required for exporters of respective commodities. |
| **EIC (Export Inspection Council) Certificate** | Mandatory pre-shipment inspection for certain products. |
| **Phytosanitary Certificate** | Required for plant and plant product exports. |
| **Health / Veterinary Certificate** | Required for animal product exports. |
| **Certificate of Origin** | Required to claim preferential tariff rates under FTAs. |
| **GMP (Good Manufacturing Practice)** | Required for pharmaceuticals, cosmetics, food processing. |
| **HALAL / KOSHER Certification** | Required for exports to specific markets (Middle East, Israel, etc.). |
| **CE Marking** | Required for products entering the European market. |
| **FDA Registration** | Required for food, drugs, medical devices entering the US market. |

### 3.5 Status & Track Record

| Field | Description |
|---|---|
| **Status Holder Classification** | One Star Export House, Two Star, Three Star, Four Star, Five Star (based on export performance). |
| **Years in Business** | Company age and trade experience. |
| **Key Markets** | Countries/regions where the company actively exports to or imports from. |
| **Trade References** | Past buyers/sellers who can vouch for reliability. |
| **Dispute History** | Any customs penalties, trade disputes, or blacklisting. |

---

## 4. Cold Email Campaign for Trade Leads

### 4.1 What a Cold Email Campaign Looks Like in Trade

A trade-focused cold email campaign involves identifying potential buyers (importers) or sellers (exporters) through trade data, building targeted prospect lists, and sending personalized outreach sequences to initiate trade relationships.

**Campaign Architecture:**

1. **Prospect Identification** -- Using customs data, trade directories, and export promotion council databases to identify companies that are already importing/exporting products in the relevant HS code categories.

2. **Data Enrichment** -- Augmenting trade data with company contact information (decision-maker names, emails, phone numbers) using databases like Apollo.io, ZoomInfo, LinkedIn, or local business registries.

3. **Segmentation** -- Grouping prospects by:
   - Product category / HS code alignment
   - Trade volume (small, medium, large importers)
   - Geography (target market)
   - Recency of trade activity (active vs. dormant)
   - Existing supplier concentration (do they rely on one source or diversify?)

4. **Personalized Outreach Sequence:**
   - **Email 1 (Introduction):** Reference their specific import/export activity (e.g., "I noticed your company imported 50 TEUs of [product] from [country] last quarter"). Offer a specific value proposition.
   - **Email 2 (Value Add):** Share market intelligence, pricing comparisons, or quality advantages.
   - **Email 3 (Social Proof):** Reference similar companies you work with, case studies, certifications.
   - **Email 4 (Direct Ask):** Request a call or sample order.
   - **Follow-up cadence:** 3-5 days between emails, with a total of 4-6 touches over 3-4 weeks.

5. **Multi-Channel Follow-up:** Combine email with LinkedIn outreach, WhatsApp (common in Asian trade), and trade fair follow-ups.

### 4.2 Data Points That Matter for Buyer-Seller Matching

**Buyer (Importer) Signals:**

| Signal | Why It Matters |
|---|---|
| **HS codes imported** | Determines product compatibility |
| **Import volume & frequency** | Indicates demand size and buying pattern |
| **Countries of origin** | Shows existing sourcing geography and diversification appetite |
| **Number of suppliers** | Single-source vs. multi-source buyer (multi-source = more open to new suppliers) |
| **Shipment recency** | Active buyer vs. dormant |
| **Company size & type** | Distributor, retailer, manufacturer (determines order size and relationship type) |
| **Port of entry** | Logistics compatibility |
| **Price points (declared value)** | Quality/price segment alignment |
| **Compliance requirements** | Certifications required in their market |
| **Payment terms history** | Financial reliability |

**Seller (Exporter) Signals:**

| Signal | Why It Matters |
|---|---|
| **HS codes exported** | Product capability |
| **Export volume & frequency** | Production capacity indicator |
| **Destination countries** | Market experience and logistics capability |
| **Number of buyers** | Diversification and reliability |
| **Certifications held** | Quality and compliance readiness |
| **Status holder classification** | Government-recognized export performance |
| **Factory/production capacity** | Ability to scale |
| **Past shipment consistency** | Reliability indicator |

### 4.3 Email Deliverability & Compliance

- **Personalized subject lines** achieve 35.69% open rates vs. 17% for generic ones.
- **GDPR and e-Privacy Directive** compliance is critical for outreach to European buyers.
- **CAN-SPAM compliance** for US-targeted outreach.
- **Domain warming and sender reputation** management is essential for sustained campaigns.
- **Intent-based targeting** (contacting buyers who are already importing your product category) dramatically improves response rates over generic blasting.

---

## 5. HS Codes and Product Classification in International Trade

### 5.1 What is the Harmonized System?

The **Harmonized Commodity Description and Coding System (HS)** is an internationally standardized system of names and numbers to classify traded products. It is administered by the **World Customs Organization (WCO)** and updated every five years.

- Used by **200+ countries and economies**
- Covers **over 98% of merchandise in international trade**
- Comprises **5,000+ commodity groups** each identified by a six-digit code

### 5.2 Code Structure

```
XX . XX . XX . XX
|    |    |    |
|    |    |    +-- Tariff Item (country-specific, digits 7-8 or 7-10)
|    |    +------- Subheading (digits 5-6, internationally standardized)
|    +------------ Heading (digits 3-4, internationally standardized)
+----------------- Chapter (digits 1-2, internationally standardized)
```

**Example: Turmeric Powder**
- `09` = Chapter (Coffee, tea, spices)
- `09.10` = Heading (Ginger, saffron, turmeric, etc.)
- `09.10.30` = Subheading (Turmeric/curcuma)
- `09.10.30.30` = ITC-HS Tariff Item (India-specific, 8-digit)

**Example: Ground Coffee from Vietnam**
- `09.01.11.90` = ITC-HS code

### 5.3 Organizational Logic

The HS is organized into **21 Sections** containing **99 Chapters**:

| Section | Chapters | Description |
|---|---|---|
| I | 1-5 | Live animals and animal products |
| II | 6-14 | Vegetable products |
| III | 15 | Animal/vegetable fats and oils |
| IV | 16-24 | Prepared foodstuffs, beverages, tobacco |
| V | 25-27 | Mineral products |
| VI | 28-38 | Chemical products |
| VII | 39-40 | Plastics and rubber |
| VIII | 41-43 | Leather, hides, skins |
| IX | 44-46 | Wood and wood products |
| X | 47-49 | Pulp, paper, paperboard |
| XI | 50-63 | Textiles and textile articles |
| XII | 64-67 | Footwear, headgear, umbrellas |
| XIII | 68-70 | Stone, ceramic, glass |
| XIV | 71 | Precious metals and stones |
| XV | 72-83 | Base metals |
| XVI | 84-85 | Machinery and electrical equipment |
| XVII | 86-89 | Vehicles, aircraft, vessels |
| XVIII | 90-92 | Optical, medical, measuring instruments |
| XIX | 93 | Arms and ammunition |
| XX | 94-96 | Miscellaneous manufactured articles |
| XXI | 97 | Works of art, antiques |

### 5.4 India-Specific: ITC-HS Codes

India uses the **Indian Trade Classification based on the Harmonized System (ITC-HS)**:
- **Schedule I** (21 sections, 98 chapters): Import policies and rules
- **Schedule II** (97 chapters): Export policies and rules
- India extends the 6-digit HS code to **8 digits** for national tariff purposes
- The structure contains 1,244 headings and 5,224 subheadings

### 5.5 Why HS Codes Matter for the Platform

- **Matching accuracy:** HS codes are the universal language for product matching between buyers and sellers across borders.
- **Duty calculation:** Correct HS code determines applicable tariffs, anti-dumping duties, and safeguard duties.
- **Regulatory compliance:** Certain HS codes trigger additional licensing, inspection, or certification requirements.
- **Trade agreement eligibility:** Preferential tariff rates under FTAs are HS-code specific.
- **Trade data analysis:** All customs databases index shipments by HS code, making it the primary key for trade intelligence.
- **AI classification:** Machine learning models can recommend HS codes from product descriptions, reducing misclassification risk.

---

## 6. Compliance and Regulatory Aspects

### 6.1 Pre-Trade Registrations (India)

| Requirement | Authority | Details |
|---|---|---|
| **IEC (Importer-Exporter Code)** | DGFT | 10-digit code, lifetime validity, mandatory for all import/export. Applied online via dgft.gov.in. Requires PAN, bank account, address proof. Fee: Rs. 500. |
| **DGFT Profile (ANF-1)** | DGFT | Master profile capturing IEC, RCMC, industrial registration, status holder details, past export performance. Must be updated annually or upon any change. |
| **RCMC** | Relevant EPC/Commodity Board | 5-year validity. Required for export incentives. Must match product category to correct council (e.g., EEPC for engineering, Pharmexcil for pharma, APEDA for agri). |
| **AD Code Registration** | Customs/Bank | Links bank account to customs port for foreign exchange handling. |
| **GST Registration** | GSTN | Required for claiming input tax credit and filing LUT for zero-rated exports. |
| **LUT (Letter of Undertaking)** | GST Authority | Filed annually. Allows export without payment of IGST. |
| **Digital Signature Certificate** | Certifying Authority | Required for electronic filing with DGFT and customs. |

### 6.2 Product-Specific Compliance

| Compliance | Products | Authority |
|---|---|---|
| **FSSAI License** | All food products | Food Safety and Standards Authority of India. Central License mandatory for food exporters. |
| **BIS/ISI Certification** | Electronics, construction materials, chemicals, consumer goods | Bureau of Indian Standards. Mandatory for listed products. |
| **Drug License** | Pharmaceuticals, medical devices | Central Drugs Standard Control Organization (CDSCO) |
| **APEDA Registration** | Agricultural and processed foods | Agricultural & Processed Food Products Export Development Authority |
| **MPEDA Registration** | Marine products | Marine Products Export Development Authority |
| **Phytosanitary Certificate** | Plants, plant products, seeds | Directorate of Plant Protection |
| **Health Certificate** | Animal products, dairy | Animal Quarantine & Inspection Services (AQIS) |
| **Pre-Shipment Inspection** | Listed products | Export Inspection Council (EIC) |

### 6.3 Export Documentation (Comprehensive List)

**Commercial Documents:**
1. Proforma Invoice -- Initial offer/quotation to the buyer
2. Commercial Invoice -- Final bill for the goods
3. Packing List -- Detailed itemization of shipment contents, weights, dimensions

**Shipping Documents:**
4. Shipping Bill -- Filed with customs for export clearance (types: free shipping bill, dutiable, drawback, DEPB)
5. Bill of Lading (B/L) -- Contract between shipper and carrier (sea freight); negotiable instrument
6. Airway Bill (AWB) -- For air freight; non-negotiable
7. Mate's Receipt -- Acknowledgment from ship's officer that goods are loaded
8. Cart Ticket / Dock Receipt -- Proof of goods received at the port

**Regulatory/Compliance Documents:**
9. Certificate of Origin -- Proves country of manufacture; needed for FTA preferential rates
10. Certificate of Inspection -- From EIC or third-party inspection agency
11. Phytosanitary Certificate -- For plant products
12. Health/Veterinary Certificate -- For animal products
13. Fumigation Certificate -- Proof of pest treatment for wooden packaging
14. Insurance Certificate -- Proof of marine/cargo insurance

**Financial Documents:**
15. Letter of Credit (L/C) -- Bank-guaranteed payment instrument
16. Bank Realization Certificate (BRC) -- Proof that export proceeds were realized
17. Foreign Inward Remittance Certificate (FIRC) -- Proof of foreign currency received

**Customs Documents:**
18. ARE-1 / ARE-2 -- Application for removal of excisable goods for export
19. GR / SDF Form -- Exchange control forms for RBI
20. Shipping Bill Number and Date -- For claiming drawback and incentives

### 6.4 Import Documentation

1. Bill of Entry (BoE) -- Mandatory customs declaration for imported goods
2. Bill of Lading / Airway Bill
3. Commercial Invoice
4. Packing List
5. Certificate of Origin
6. Insurance Certificate
7. Import License (if applicable for restricted items)
8. BIS/FSSAI/Drug Controller clearance (as applicable)
9. GATT Valuation Declaration
10. Industrial License (for specific items)

### 6.5 Post-Trade Compliance

- **EDPMS (Export Data Processing and Monitoring System):** RBI system tracking export transactions and foreign exchange realization.
- **Duty Drawback Claims:** Refund of customs duty on inputs used in exported goods.
- **MEIS/SEIS/RoDTEP:** Government export incentive schemes requiring HS-code-specific claims.
- **Annual IEC Update:** IEC holders must update their profile annually on the DGFT portal.

### 6.6 Key Regulatory Bodies

| Body | Role |
|---|---|
| **DGFT** | Overall export-import policy, IEC issuance, licensing |
| **Indian Customs (CBIC)** | Customs clearance, duty assessment, enforcement |
| **RBI** | Foreign exchange regulations, FEMA compliance |
| **FSSAI** | Food safety standards |
| **BIS** | Product standards and certification |
| **EIC** | Pre-shipment inspection |
| **APEDA/MPEDA/Commodity Boards** | Sector-specific export regulation |

---

## 7. Counterparty Matching: Signals for a Good Match

### 7.1 Matching Framework

Counterparty matching in international trade should evaluate compatibility across multiple dimensions. Here is a comprehensive signal framework:

### 7.2 Product Compatibility (Primary Filter)

| Signal | How to Evaluate |
|---|---|
| **HS Code Alignment** | Exact match at 6-digit level (international) or 8-digit level (country-specific). The most fundamental matching criterion. |
| **Product Description Overlap** | NLP-based semantic similarity between exporter's product descriptions and importer's historical import descriptions. |
| **Product Specifications** | Grade, quality tier, technical specifications match. E.g., "Basmati rice 1121 Sella" vs. generic "rice." |
| **Volume Compatibility** | Exporter's production capacity aligns with importer's typical order size. An exporter shipping 10 containers/month should not be matched with a buyer ordering 1 pallet/year. |
| **Price/Value Segment** | Declared customs value per unit indicates quality tier. Premium exporters should match with premium importers. |

### 7.3 Geographic & Logistics Compatibility

| Signal | How to Evaluate |
|---|---|
| **Trade Route Viability** | Exporter's port of loading to importer's port of discharge -- is there an efficient shipping route? |
| **Existing Market Experience** | Has the exporter previously shipped to the importer's country? (Reduces friction, indicates familiarity with regulations.) |
| **Proximity to Existing Suppliers** | Importers are more likely to trust exporters from regions where they already have suppliers, as they can leverage existing knowledge networks for verification. |
| **Time Zone & Language** | Operational compatibility for communication. |
| **Free Trade Agreement Coverage** | If exporter's country and importer's country share an FTA, duty advantages make the match more attractive. |

### 7.4 Compliance & Certification Compatibility

| Signal | How to Evaluate |
|---|---|
| **Certification Match** | Does the exporter hold certifications required by the importer's market? (e.g., CE for EU, FDA for US, HALAL for Middle East, BIS for India). |
| **Regulatory Readiness** | Does the exporter have the necessary licenses and registrations (FSSAI for food, Drug License for pharma, APEDA for agriculture)? |
| **Standards Compliance** | ISO, GMP, HACCP, organic certifications that the buyer's market or buyer's own procurement policies require. |
| **Country-Specific Restrictions** | Are there any trade embargoes, sanctions, anti-dumping duties, or countervailing duties between the countries? |

### 7.5 Commercial & Financial Compatibility

| Signal | How to Evaluate |
|---|---|
| **Payment Terms Compatibility** | Exporter's acceptable payment terms vs. importer's preferred terms (advance payment, L/C, DA, DP, open account). |
| **Trade Finance Readiness** | Does the exporter have L/C handling capability? Does the importer have creditworthiness for open account terms? |
| **Incoterms Preference** | FOB vs. CIF vs. DDP -- determines who bears logistics responsibility and cost. |
| **Order Size Alignment** | MOQ (minimum order quantity) of the exporter vs. typical order size of the importer. |
| **Currency & Forex Considerations** | Stable currency corridors vs. volatile ones; hedging capability. |

### 7.6 Trust & Reputation Signals

| Signal | How to Evaluate |
|---|---|
| **Trade History Depth** | How many years has the entity been actively trading? Longer history = more reliable. |
| **Shipment Consistency** | Regular, predictable shipping patterns vs. sporadic activity. |
| **Supplier/Buyer Diversification** | Companies with multiple trading partners are generally more stable than single-counterparty operators. |
| **Customs Compliance Record** | Any history of customs penalties, detentions, or disputes? |
| **Government Recognition** | Status Holder certification (Star Export House, etc.) indicates government-vetted performance. |
| **Third-Party Verification** | Verified by trade platforms, chambers of commerce, or export promotion councils. |
| **Financial Health** | Credit ratings, registered capital, revenue data (where available). |

### 7.7 Behavioral & Intent Signals

| Signal | How to Evaluate |
|---|---|
| **Sourcing Diversification Intent** | Importers relying on a single source country are strong prospects for alternative suppliers (supply chain de-risking). |
| **New Market Entry Signals** | Exporters showing first-time shipments to a new country indicate market expansion intent -- match with established importers in that country. |
| **Volume Growth Trend** | Increasing import/export volumes over time indicate a growing business that needs more counterparties. |
| **Product Range Expansion** | Companies importing/exporting new HS codes indicate category expansion. |
| **Recency of Activity** | Companies with shipments in the last 90 days are actively trading; those dormant for 12+ months may be inactive. |

### 7.8 Match Scoring Model (Conceptual)

A weighted scoring model could combine these signals:

```
Match Score =
  (Product Compatibility * 0.30) +
  (Volume/Size Alignment * 0.15) +
  (Geographic Compatibility * 0.10) +
  (Certification Match * 0.15) +
  (Trust/Reputation Score * 0.15) +
  (Commercial Compatibility * 0.10) +
  (Intent/Behavioral Signals * 0.05)
```

Threshold: Matches scoring above 70/100 could be surfaced as "High Confidence" matches, 50-70 as "Moderate," and below 50 filtered out.

### 7.9 Anti-Signals (Red Flags)

| Red Flag | Implication |
|---|---|
| **Trade embargo between countries** | Match is illegal/impossible |
| **Anti-dumping duty on the product** | Match is commercially unviable |
| **Exporter lacks required certifications** | Shipments will be blocked at destination customs |
| **Extreme volume mismatch** | Wasted outreach effort |
| **Customs penalty history** | High-risk counterparty |
| **Dormant for 18+ months** | Possibly out of business |
| **Single product, single market dependency** | Fragile business model |

---

## Summary: Platform Opportunity

The research reveals a clear market gap. Existing platforms fall into two categories:

1. **Directories/Marketplaces** (IndiaMART, Alibaba, TradeIndia, Kompass) -- They connect buyers and sellers but provide no intelligence, no compliance support, no documentation management, and no quality-assured matching. They are plagued by fake leads, unverified suppliers, and zero post-listing support.

2. **Trade Data Providers** (ExportGenius, ImportGenius, Datamyne, PIERS) -- They provide raw customs and shipment data but require expertise to analyze, offer no matchmaking, and no execution support.

**The "done for you" AI-powered platform opportunity sits at the intersection:**

- **AI-Powered Matching:** Using HS codes, trade data, certifications, geographic compatibility, and behavioral signals to automatically surface high-quality counterparty matches.
- **Compliance Automation:** Auto-generating documentation, checking regulatory requirements by product-country pair, and flagging missing certifications.
- **Outreach Automation:** AI-crafted, personalized cold emails referencing actual trade data (import volumes, product categories) to drive high response rates.
- **End-to-End Facilitation:** From match discovery through documentation, logistics coordination, and payment facilitation.
- **Profile Intelligence:** Building rich exporter/importer profiles from trade data, certifications, and behavioral signals -- not just self-reported directory listings.

---

## Sources

- [WTO: Trade obstacles to SME participation in trade](https://www.wto.org/english/res_e/booksp_e/wtr16-4_e.pdf)
- [WTO: Trade finance and SMEs](https://www.wto.org/english/res_e/booksp_e/tradefinsme_e.pdf)
- [WEF: How small businesses can navigate global trade](https://www.weforum.org/stories/2025/05/small-businesses-msmes-global-trade-polycrisis/)
- [IDB Invest: SMEs and the Challenge to Export](https://idbinvest.org/en/blog/development-impact/smes-and-challenge-export)
- [SBA: Small Business Exports Issue Brief](https://advocacy.sba.gov/wp-content/uploads/2024/03/Issue-Brief-No.-19-Small-Business-Exports.pdf)
- [CNABKE: Cross-Border Logistics Challenges for SMEs](https://www.cnabke.com/en/blogs/a-deep-dive-into-cross-border-logistics-and-operational-challenges-for-smes-international-shipping-and-customs-compliance-case-studies.html)
- [Morgan Lewis: US International Trade Key Shifts 2025-2026](https://www.morganlewis.com/pubs/2026/01/us-international-trade-and-investment-key-shifts-in-2025-and-what-businesses-should-know-for-2026)
- [IndiaMART Alternatives - B2BOneMart](https://b2bonemart.com/indiamart-alternatives/)
- [IndiaMART vs TradeIndia - B2BOneMart](https://b2bonemart.com/indiamart-vs-tradeindia/)
- [Alibaba: Popular B2B E-Commerce Platforms](https://seller.alibaba.com/businessblogs/7-popular-b2b-e-commerce-platforms-for-your-business-px002c0r3)
- [Marketing91: IndiaMART Alternatives & Competitors 2026](https://www.marketing91.com/indiamart-competitors/)
- [ImportGenius](https://www.importgenius.com/)
- [ExportGenius](https://www.exportgenius.in/)
- [ImportGenius vs ExportGenius Comparison](https://w3.importgenius.com/comparison/exportgenius)
- [Kompass Global B2B Directory](https://us.kompass.com/)
- [Kompass on Datarade](https://datarade.ai/data-providers/kompass/profile)
- [DGFT: IEC Profile Management](https://www.dgft.gov.in/CP/?opt=iec-profile-management)
- [DGFT: IEC FAQs](https://content.dgft.gov.in/Website/DGFT%20-%20Profile%20Management%20(IEC)%20FAQs%20v1.0.pdf)
- [ClearTax: Import Export Code](https://cleartax.in/s/import-export-code)
- [DGFT: Customs Import Export Procedures](https://content.dgft.gov.in/Website/CIEP.pdf)
- [Bhatt & Joshi: Regulatory Framework India Import Export](https://bhattandjoshiassociates.com/policy-and-laws-india-governing-import-export-in-india/)
- [IndiaFilings: DGFT IEC Code](https://www.indiafilings.com/learn/dgftieccode/)
- [Freightos: IEC Code Export India](https://www.freightos.com/freight-resources/iec-code-export-india/)
- [RCMC Certificate - RazorPay](https://razorpay.com/blog/rcmc-certificate/)
- [RCMC Registration - IndiaFilings](https://www.indiafilings.com/rcmc-registration)
- [WCO: What is the Harmonized System](https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx)
- [US Trade.gov: HS Codes Overview](https://www.trade.gov/feature-article/overview-harmonized-system-codes)
- [Shopify: HTS Codes 2026 Guide](https://www.shopify.com/blog/hts-codes)
- [DHL: Understanding HS Codes](https://www.dhl.com/discover/en-us/global-logistics-advice/import-export-advice/understanding-hs-codes)
- [Freightos: HS Code Finder](https://www.freightos.com/freight-resources/harmonized-system-code-finder-hs-code-lookup/)
- [EximGuru: ITC HS Codes](https://www.eximguru.com/hs-codes/default.aspx)
- [Cogoport: HS Code Classification](https://www.cogoport.com/en/blogs/hs-code-all-about-classification-of-goods-in-export-import)
- [Import Export Federation: Documents Required for Export](https://importexportfederation.com/documents-required-for-export/)
- [KarbonCard: 17 Must-Have Export Documents](https://www.karboncard.com/blog/export-document)
- [iThinkLogistics: Export Documentation Guide](https://www.ithinklogistics.com/blog/export-documentation-compliance-guide-for-indian-businesses/)
- [ClearTax: FSSAI BIS Certificate](https://cleartax.in/s/fssai-bis-certificate)
- [China Briefing: BIS Certification Guide](https://www.china-briefing.com/china-outbound-news/a-guide-to-bis-certification-in-india-for-foreign-manufacturers)
- [LegalDalal: ISO vs BIS vs FSSAI Certification](https://legaldalal.com/iso-bis-or-fssai-choose-the-right-certification/)
- [Import Export Federation: Finding Buyers and Trade Leads](https://importexportfederation.com/how-exporters-can-easily-find-buyers-and-import-export-trade-leads/)
- [SalesHandy: Cold Email Lead Generation](https://www.saleshandy.com/blog/cold-email-lead-generation/)
- [MarketingProfs: B2B Cold Email Strategy](https://www.marketingprofs.com/articles/2026/54183/b2b-cold-email-strategy-ai-deliverability)
- [NovaFori: Matching Buyers to Products](https://www.novafori.com/blog/matching-the-right-buyers-to-the-right-products-at-the-right-time)
- [ScienceDirect: Buyer-Seller Relationships in International Trade](https://www.sciencedirect.com/science/article/abs/pii/S0022199616300848)
- [Revenue Vessel: Generate Leads with US Customs Data](https://www.revenuevessel.com/blogs/generate-leads-us-customs-data)
- [WCO: AI for HS Classification](https://www.wcoomd.org/en/media/newsroom/2022/april/how-ai-can-help-customs-in-automating-hs-classification.aspx)
- [Is IndiaMART Legit? - MyWifeQuitHerJob](https://mywifequitherjob.com/is-indiamart-legit/)
- [IndiaMART Reviews - Trustpilot](https://www.trustpilot.com/review/m.indiamart.com)
- [TradeIndia Reviews - Trustpilot](https://www.trustpilot.com/review/tradeindia.com)
