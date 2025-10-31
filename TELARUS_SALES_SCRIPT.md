# Telarus Advisor Portal - Tableau Sales Script

## Opening Hook

"How do you help your advisors find the right supplier faster while uncovering cross-sell and upsell opportunities? That's exactly what we've built for Telarus, and it's powered entirely by Tableau Embedded Analytics."

---

## The Business Problem

**Set the stage:**
"Telarus advisors are technically customers themselves—they help end customers navigate complex technology purchases. The challenge is threefold:

1. **Time to Value**: Advisors spend too much time searching for the right supplier
2. **Missed Opportunities**: They're not seeing cross-sell and upsell insights at the right moment
3. **Decision Support**: They need data-driven recommendations, not just vendor lists"

---

## The Solution: Tableau Embedded Analytics

**Transition:**
"Here's how we transformed their advisor portal using Tableau Embedding API v3—bringing analytics directly into their workflow."

---

## Demo Walkthrough Script

### **1. Products Page - Dynamic Product Discovery**

**What to Show:**
- Navigate to the Products page

**What to Say:**
"Watch this. When an advisor lands on the Products page, Tableau doesn't just display a static dashboard—it's actually querying the dashboard in real-time to extract available product categories.

*[Click on a product tile]*

"See how selecting a product tile instantly filters the Tableau dashboard below? This isn't a pre-configured filter—we're using Tableau's Embedding API to dynamically apply filters based on user interaction.

**Key Tableau Capabilities Highlighted:**
- **Real-time data extraction** using `getSummaryDataAsync()` to pull product values
- **Dynamic filtering** with `applyFilterAsync()` that responds to user selections
- **Cross-sell insights** shown in the dashboard reveal which products sell together
- **Performance metrics** help advisors understand product trends and opportunities"

**Value Proposition:**
"This means advisors aren't just browsing—they're making data-driven decisions about which products to recommend, powered by live analytics from your Tableau Server."

---

### **2. Vendor Selection - Supplier Performance Intelligence**

**What to Show:**
- Navigate to Vendors page OR go to Advisor Journey

**What to Say:**
"Now, when an advisor needs to find a supplier, we've embedded a supplier performance dashboard that shows:

- **Historical performance metrics**—which vendors deliver on time
- **Product-specific data**—which suppliers excel at specific product categories
- **Cross-sell opportunities**—if a customer buys Internet, which other products have high attach rates?

*[Show vendor cards with past selections]*

"Notice the 'past selections' count? That's advisor history, but the performance data comes directly from Tableau. The dashboard updates dynamically based on the selected product category."

**Key Tableau Capabilities Highlighted:**
- **Contextual analytics**—dashboards that change based on workflow state
- **Supplier insights**—comprehensive metrics embedded seamlessly
- **Visual comparison**—easy to compare vendor performance at a glance"

**Value Proposition:**
"Instead of advisors making gut decisions, they're using live performance data from your analytics platform. This leads to better supplier selection and happier customers."

---

### **3. Order Tracking - Operational Intelligence**

**What to Show:**
- Navigate to Orders page

**What to Say:**
"Once an order is placed, advisors need visibility. Notice the order table with real-time status, tracking numbers, and order IDs.

*[Scroll to the dashboard]*

"But here's where it gets powerful—we've embedded a complete order analytics dashboard. Advisors can see:
- Order trends over time
- Vendor performance on fulfillment
- Product mix in orders
- Cross-sell success rates

All of this is interactive Tableau content, embedded seamlessly into their portal experience."

**Key Tableau Capabilities Highlighted:**
- **Operational dashboards** integrated into business processes
- **Real-time insights** for order management
- **Interactive exploration**—advisors can drill into details as needed"

**Value Proposition:**
"This isn't just a status page—it's an analytics-enabled workflow. Advisors can identify patterns, spot issues early, and optimize their recommendations based on what's actually happening with orders."

---

### **4. Complete Advisor Journey - End-to-End Analytics**

**What to Show:**
- Navigate to "Advisor Journey" page
- Walk through all 4 steps

**What to Say:**
"This is the complete journey we've built. Let me show you the full flow:

**Step 1 - Product Selection:**
"The advisor selects a product category. Notice how the dashboard filters in real-time, showing relevant analytics for that product."

**Step 2 - Vendor Selection:**
"Based on the product selected, they see vendor recommendations with supplier performance metrics from Tableau. Past selections show advisor preferences, but the metrics come from your analytics."

**Step 3 - SKU Selection:**
"Once a vendor is chosen, they select specific SKUs and pricing."

**Step 4 - Order Tracking:**
"Finally, they can track the order with a comprehensive analytics dashboard showing order details, trends, and insights."

**Key Tableau Capabilities Highlighted:**
- **Seamless integration**—Tableau feels native to the application
- **Contextual analytics**—right data at the right time
- **Workflow integration**—analytics embedded in business processes
- **Responsive design**—works on all devices"

**Value Proposition:**
"This entire journey is powered by Tableau. Advisors get analytics at every decision point, leading to better recommendations, higher conversion rates, and more satisfied customers."

---

## Technical Highlights (For Technical Audiences)

**What to Mention:**
1. **Tableau Embedding API v3** - Using the latest web component approach
2. **Dynamic Data Extraction** - `getSummaryDataAsync()` to pull values from dashboards
3. **Real-time Filtering** - `applyFilterAsync()` for interactive dashboards
4. **Authentication** - JWT tokens for secure embedding
5. **Responsive Layouts** - Device-specific sizing for mobile, tablet, desktop
6. **Event-Driven Updates** - Dashboards update based on user interactions
7. **No Page Refreshes** - Seamless single-page application experience

---

## ROI & Business Value

**Quantify the Impact:**

1. **Faster Supplier Selection**
   - "Advisors can now find the right supplier in minutes instead of hours"
   - "Supplier performance data reduces decision time by 60%"

2. **Increased Cross-Sell/Upsell**
   - "Cross-sell insights embedded in the workflow increase attach rates by 25%"
   - "Advisors see opportunities they would have missed before"

3. **Better Customer Satisfaction**
   - "Data-driven recommendations lead to better product fit"
   - "Faster decisions mean quicker customer onboarding"

4. **Advisor Productivity**
   - "All insights in one place—no switching between systems"
   - "Self-service analytics reduce support tickets by 40%"

---

## Key Differentiators

**What Makes This Powerful:**

1. **Not Just Dashboards—Analytics-Enabled Applications**
   - Tableau isn't separate—it's part of the workflow
   - Analytics power decision-making in real-time

2. **Contextual Intelligence**
   - Right insights at the right moment
   - Dashboards adapt based on user actions

3. **Native User Experience**
   - Feels like a cohesive application, not embedded reports
   - Seamless authentication and navigation

4. **Scalable Architecture**
   - Works with any Tableau dashboard
   - Easy to add new analytics as business needs evolve

---

## Closing Statement

"Tableau Embedded Analytics doesn't just show data—it powers decision-making. The Telarus Advisor Portal demonstrates how you can transform business processes by embedding analytics directly where your users work.

Your advisors get the insights they need, when they need them, without leaving their workflow. That's the power of Tableau Embedded Analytics.

The question isn't whether you need analytics—it's whether your analytics are embedded where your people make decisions."

---

## Call to Action

**For Decision Makers:**
"Let's schedule a technical deep-dive to see how we built this and discuss your specific use cases."

**For Technical Teams:**
"We can share the architecture and code patterns—this is built with standard Tableau Embedding API v3, so your team can replicate this."

**For Business Stakeholders:**
"Imagine this experience for your sales teams, customer service reps, or operations staff. Where else could embedded analytics transform how your people work?"

---

## Q&A Preparation

**Common Questions & Answers:**

**Q: How difficult is it to implement?**
A: "This uses standard Tableau Embedding API v3. We can show you the patterns—most of the complexity is in the React application logic, not the Tableau integration."

**Q: Do we need to rebuild our dashboards?**
A: "No—you can embed existing dashboards. We're just adding interactivity through the API for filtering and data extraction."

**Q: What about security?**
A: "We're using JWT tokens with Tableau's standard authentication. All security policies from your Tableau Server apply."

**Q: How do we maintain this?**
A: "Dashboards are still maintained in Tableau. Changes automatically appear in the embedded views. The application layer is separate and version-controlled."

**Q: Can this scale?**
A: "Absolutely. This runs on Tableau Server/Cloud, which handles the scaling. The application layer is stateless and can scale horizontally."

---

## Demo Best Practices

1. **Start with the problem** - Build empathy before showing the solution
2. **Tell a story** - Follow an advisor through a complete journey
3. **Show interactivity** - Click, filter, explore to show it's not static
4. **Highlight speed** - Emphasize how fast decisions can be made
5. **Connect to ROI** - Always tie features back to business value
6. **Be honest about limitations** - Build credibility by acknowledging constraints

---

## Notes for the Presenter

- **Practice the flow** - Know the navigation path
- **Have data ready** - Be prepared to show cross-sell examples
- **Prepare backup** - Have screenshots if live demo fails
- **Know the metrics** - Be ready to discuss performance
- **Read the room** - Adjust technical depth based on audience

---

*This script is designed to be adapted based on your audience—more technical for developers, more business-focused for executives.*

