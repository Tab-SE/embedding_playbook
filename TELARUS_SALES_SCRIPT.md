# Telarus Advisor Portal - Tableau Sales Script

## Opening Hook

"An advisor gets a call: 'I need reliable internet for my growing business, and I'm not sure which provider is best for my needs.'

That advisor needs to:
- Find the right supplier quickly
- Understand which products sell well together
- Make data-driven recommendations
- Discover upsell opportunities

How do you empower them to do all of that in minutes, not hours? That's exactly what we've built for Telarus, and it's powered entirely by Tableau Embedded Analytics."

---

## The Advisor Journey - Starting with a Customer Need

**Set the stage with a real scenario:**
"Every advisor visit starts with a customer query or business need. Let me walk you through a typical scenario:

*[Pause for effect]*

**The Scenario:**
An advisor's customer calls and says: 'I need to upgrade my internet service. What should I get, and who should I go with?'

The advisor needs to:
1. Understand what products are available and how they perform
2. Find suppliers that excel at internet services
3. See which additional products (voice, security, managed services) sell well with internet
4. Make a recommendation based on data, not guesswork
5. Identify cross-sell opportunities to maximize value

This is where Tableau Embedded Analytics transforms their workflow from reactive to proactive, from guessing to data-driven."

---

## The Solution: Tableau Embedded Analytics

**Transition:**
"Here's how we transformed their advisor portal using Tableau Embedding API v3—bringing analytics directly into their workflow."

---

## Demo Walkthrough Script

### **Click Path Overview:**
1. **Insights Page** → Select a product tile (e.g., "Internet")
2. **Insights Page** → Scroll to see cross-sell insights, select region (e.g., "North")
3. **Insights Page** → View "Who Should I Go With?" section
4. **Navigate to Vendors Page** → See vendor recommendations
5. **Navigate to Orders/Tracking Page** → View order tracking
6. **(Optional) Navigate to Advisor Journey** → Show complete flow

---

### **1. Products Page - Starting with the Customer Need**

**Set the Scenario:**
"An advisor comes to the portal because their customer needs internet service. Let's see how they find the right solution."

**Click Path:**
1. Navigate to `/demo/telarus` (Products page)
2. Point out the product tiles at the top
3. **Click on "Internet" product tile**

**What to Say:**
"When an advisor lands here, they see product categories that are dynamically loaded from Tableau. But here's the key—this isn't just a menu. Each product represents a customer need.

*[Click on 'Internet' tile]*

"Watch what happens. The advisor selects 'Internet' because that's what their customer needs. Instantly, the dashboard below filters to show:
- Internet sales trends
- Which regions have the best internet sales
- Most importantly, **which products sell well WITH internet**—this is the cross-sell goldmine.

The dashboard is showing them: '78% of customers who buy Internet also purchase Voice services. 65% add SD-WAN. Here's your upsell roadmap.'"

**Key Tableau Capabilities Highlighted:**
- **Real-time data extraction** - Product categories come directly from your analytics
- **Dynamic filtering** - Dashboard responds instantly to product selection
- **Cross-sell intelligence** - Product bundling visualizations show correlation and attach rates
- **Upsell probability** - Heatmap reveals which combinations have highest success rates
- **Actionable insights** - Advisors see expected revenue and bundle sales data"

**Value Proposition:**
"This isn't just showing data—it's answering the question: 'If my customer buys Internet, what else should I recommend, and what's the probability they'll say yes?'

That advisor now has a data-driven upsell strategy before they even contact a supplier."

**Continue on Products Page:**
4. **Scroll down to "Regional Performance" section**
5. **Click on "North" region button** (or any region that matches your demo customer scenario)
6. **Scroll to "Who Should I Go With?" section** (appears after selecting product + region)
7. **Point out the RECOMMENDED vendor card** showing FastFiber (or the top vendor)
8. **Highlight the comparison table** showing all suppliers ranked by performance

**What to Say:**
"Now watch what happens when we add the customer's location. The advisor knows their customer is in the North region. *[Click North region]*

Look at this—the dashboard now shows supplier recommendations specifically for Internet service in the North region. FastFiber is recommended because they have 92% SLA compliance, 3.8 day average delivery, and a 94% success rate specifically for Internet in the North.

This is answering the question: 'Who should I go with?' with data that's specific to the product AND the region."

---

### **2. Vendor Selection - Finding the Right Supplier for the Customer Need**

**Continue the Scenario:**
"Now the advisor knows their customer should consider Internet + Voice (78% correlation). But which supplier should they recommend?"

**Click Path:**
1. **Navigate to Vendors page** (click "Vendors" in sidebar, or use URL: `/demo/telarus/vendors?product=internet`)
2. Show vendor cards with performance data
3. **Point to the supplier dashboard** embedded below

**What to Say:**
"With the customer need defined—Internet for a growing business—the advisor now needs to find a supplier. But not just any supplier. They need one that:
- Delivers internet services reliably (SLA compliance data)
- Has strong performance in voice services (since that's the likely upsell)
- Has good delivery times (customer is growing, they need speed)

*[Point to the supplier dashboard]*

"Look at this. The embedded Tableau dashboard shows supplier performance metrics, filtered to the specific product category. The advisor can see:
- **Delivery time by vendor**—who gets internet installed fastest?
- **SLA compliance rates**—who meets their service level agreements?
- **Upsell success rates**—which vendors have the best attach rates for voice + internet bundles?

Notice how FastFiber has 78% SLA compliance and only 4.2 days average delivery time? That's actionable data. The advisor can now confidently say to their customer: 'Based on performance data, I recommend FastFiber. They deliver in 4 days and have a 78% success rate. Plus, 45% of their internet customers add voice services—should we explore that?'"

**Key Tableau Capabilities Highlighted:**
- **Contextual analytics** - Dashboard filters automatically based on selected product
- **Supplier performance intelligence** - Real-time metrics help advisors make informed recommendations
- **Comparative analysis** - Easy visual comparison of vendor performance
- **Workflow integration** - Analytics appear exactly when advisors need them"

**Value Proposition:**
"The advisor isn't guessing which supplier to recommend. They're using live performance data to make a recommendation backed by analytics. That builds trust with customers and increases success rates."

---

### **3. Order Tracking - Validating Recommendations & Learning**

**Continue the Scenario:**
"The advisor recommended FastFiber with Internet + Voice. The order was placed. Now, how do they track it and learn for next time?"

**Click Path:**
1. **Navigate to Orders/Tracking page** (click "Orders" in sidebar, or use URL: `/demo/telarus/tracking`)
2. **Point to order table** showing recent orders
3. **Scroll down to order analytics dashboard**

**What to Say:**
"After making a recommendation and placing an order, advisors need to:
1. Track the order status
2. Validate their recommendation was good
3. Learn what worked for future customers

*[Point to order table]*

"The order table shows status, tracking, and vendor—but watch the dashboard below.

*[Scroll to dashboard]*

"This embedded analytics dashboard shows:
- **Order fulfillment trends** - Are FastFiber orders actually being delivered on time?
- **Cross-sell success validation** - Of orders placed, how many actually included the voice upsell?
- **Product mix analysis** - Which product combinations are completing successfully?
- **Vendor performance trends** - Is FastFiber maintaining their 4.2 day delivery average?

If the advisor sees that FastFiber's delivery times are increasing or cross-sell attach rates are dropping, they can adjust their recommendations for the next customer. This creates a continuous learning loop."

**Key Tableau Capabilities Highlighted:**
- **Operational intelligence** - Real-time order analytics embedded in workflow
- **Performance validation** - Advisors can verify if their recommendations were accurate
- **Pattern recognition** - Identify trends in successful orders vs. problematic ones
- **Predictive insights** - Use historical data to improve future recommendations"

**Value Proposition:**
"Every order becomes a learning opportunity. Advisors can see if their recommendations worked, which vendors are performing, and which product bundles are successful. This creates a feedback loop that makes advisors better over time."

---

### **4. Complete Advisor Journey - From Customer Need to Solution**

**The Full Story:**
"Let me show you the complete advisor journey, from customer query to order placement."

**Click Path - Advisor Journey:**
1. **Navigate to "Advisor Journey" page** (click "Advisor Journey" in sidebar, or use URL: `/demo/telarus/journey`)
2. **Step 1: Products** - Click on "Internet" product tile → Show cross-sell insights
3. **Click "View Vendors" button** → Moves to Step 2
4. **Step 2: Vendors** - Select a vendor (e.g., FastFiber) → Show supplier metrics
5. **Click "View SKUs" button** → Moves to Step 3
6. **Step 3: SKUs** - Select a SKU → Show order tracking dashboard
7. **Click "Track Order" button** → Moves to Step 4
8. **Step 4: Orders** - Show order details and tracking analytics

**What to Say:**
"Remember our advisor with the customer who needs internet? Here's their complete journey:

**Step 1 - Understanding the Customer Need:**
*[Select Internet product]*

"The customer called needing internet service. The advisor selects 'Internet' and immediately sees:
- Internet sales trends
- **Critical insight: Internet + Voice has 78% correlation with 45% attach rate**
- Regional performance showing where internet sells best

The advisor now knows: 'My customer needs internet, but I should also propose voice. The data shows a 78% probability they'll accept it.'"

**Step 2 - Finding the Right Supplier:**
*[Move to vendor selection]*

"With the product combination identified (Internet + Voice), the advisor needs to find a supplier. The dashboard now shows:
- Vendors that excel at internet services
- Their performance specifically for internet+voice bundles
- Delivery times and SLA compliance

The advisor sees FastFiber has 4.2 day delivery and 85% SLA compliance for internet. Perfect for a growing business that needs speed and reliability."

**Step 3 - Selecting the Right Package:**
*[Show SKU selection]*

"Now the advisor selects the specific SKU and pricing tier that matches the customer's needs. The analytics helped them:
- Identify the right products to bundle
- Choose a supplier with proven performance
- Now they select the appropriate service tier"

**Step 4 - Tracking & Learning:**
*[Show order tracking]*

"After placing the order, the advisor tracks it and the dashboard shows:
- Order fulfillment progress
- Whether the voice upsell was included (validating the cross-sell recommendation)
- Vendor performance on this specific order type

Next time a customer calls needing internet, this advisor will be even better prepared with validated data."

**Key Tableau Capabilities Highlighted:**
- **Context-driven analytics** - Data appears based on customer needs and workflow state
- **Actionable insights** - Not just reporting, but recommendations
- **End-to-end intelligence** - Analytics at every decision point
- **Continuous learning** - Feedback loop improves advisor performance over time"

**Value Proposition:**
"This journey transforms how advisors work. Instead of starting with a blank slate for every customer, they start with data-driven insights. Every customer interaction becomes more valuable, more efficient, and more successful."

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

**Quantify the Impact - Customer-Driven Metrics:**

1. **Faster Time-to-Recommendation**
   - "Advisors can now answer customer queries with data-backed recommendations in minutes instead of researching for hours"
   - "Supplier performance data reduces decision time by 60%—advisors can respond to customer needs faster"

2. **Increased Cross-Sell/Upsell Success**
   - "Product bundling insights show advisors exactly which products sell together—attach rates increase by 25%"
   - "Upsell probability matrix helps advisors prioritize the highest-probability opportunities"
   - "Advisors know before they call: '78% of internet customers add voice'—that's a confident upsell pitch"

3. **Better Customer Outcomes**
   - "Data-driven recommendations lead to better product fit—customers get what they actually need"
   - "Supplier performance data ensures customers work with vendors that deliver on time and meet SLAs"
   - "Fewer failed implementations mean happier customers and better retention"

4. **Advisor Effectiveness**
   - "Advisors become trusted advisors, not just order takers—they bring insights to every conversation"
   - "Self-service analytics mean advisors don't need to call support for basic questions—40% reduction in support tickets"
   - "Every customer interaction makes advisors smarter through data validation and learning"

---

## Key Differentiators

**What Makes This Powerful:**

1. **Customer-Need Driven, Not Just Data-Driven**
   - Every interaction starts with a customer query or business need
   - Analytics appear contextually to answer specific questions
   - Not generic reports—insights tailored to the customer situation

2. **Advisor-Centric Design**
   - Built for the advisor workflow, not the data structure
   - Analytics answer: "What should I recommend for this customer?"
   - Visualizations show probability and opportunity, not just numbers

3. **Proactive Intelligence**
   - Product bundling shows cross-sell opportunities before advisors ask
   - Upsell probability matrix highlights best opportunities
   - Advisors come prepared with data-driven recommendations

4. **Continuous Learning Loop**
   - Order tracking validates recommendations
   - Performance data improves future suggestions
   - Every customer interaction makes advisors better

5. **Native User Experience**
   - Analytics feel integrated, not embedded
   - Seamless flow from customer need to solution to validation
   - No context switching—everything in one place

---

## Closing Statement

"Every advisor visit starts with a customer need: 'I need internet service' or 'What's the best voice solution?'

Tableau Embedded Analytics transforms how advisors respond. Instead of guessing, they have data. Instead of generic recommendations, they have insights tailored to the customer's specific situation.

The Telarus Advisor Portal shows how analytics can be embedded directly in the advisor workflow—answering customer questions with data, identifying upsell opportunities automatically, and validating recommendations through continuous learning.

Your advisors don't just access dashboards—they use analytics to solve customer problems faster and more effectively. That's the power of Tableau Embedded Analytics.

The question isn't whether you need analytics—it's whether your analytics help your people answer customer questions and solve business problems in real-time."

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

1. **Start with a customer scenario** - "An advisor gets a call..." sets the stage
2. **Follow the advisor's journey** - From customer need to recommendation to validation
3. **Highlight the "aha moments"** - "78% correlation means..." helps advisors understand probability
4. **Show the data-driven decision** - Don't just show charts—show how advisors use them
5. **Emphasize customer outcomes** - Better recommendations = happier customers
6. **Demonstrate speed** - "In 2 minutes, the advisor knows..." shows efficiency
7. **Connect insights to action** - Every visualization should answer a customer question

---

## Detailed Click Paths Reference

### **Full Demo Flow (Recommended for Sales Presentations):**

1. **Start:** Navigate to `/demo/telarus` (or `/demo/telarus/custom` for custom dashboards)
   - Products page loads automatically

2. **Products Page - Answer "What should I recommend?"**
   - Click "Internet" product tile
   - Scroll to see:
     - Sales Trends (Internet over time)
     - Top Cross-Sell Opportunities table (shows Voice 78%, SD-WAN 65%, etc.)
     - Cross-Sell Opportunities chart
   - **Select Region:** Scroll to "Regional Performance", click "North" region button
   - Scroll to see "Who Should I Go With?" section:
     - RECOMMENDED vendor card (FastFiber with metrics)
     - All Suppliers comparison table
     - Supplier Performance chart

3. **Vendors Page - Answer "Who should I go with?"**
   - Click "Vendors" in sidebar (or URL: `/demo/telarus/vendors?product=internet`)
   - Show vendor cards with past selections
   - Point to supplier performance dashboard below

4. **Orders Page - Answer "Did my recommendation work?"**
   - Click "Orders" in sidebar (or URL: `/demo/telarus/tracking`)
   - Show order table
   - Scroll to order analytics dashboard

5. **Advisor Journey (Optional - Complete Flow)**
   - Click "Advisor Journey" in sidebar (or URL: `/demo/telarus/journey`)
   - Walk through all 4 steps:
     - Step 1: Products → Select Internet → Click "View Vendors"
     - Step 2: Vendors → Select FastFiber → Click "View SKUs"
     - Step 3: SKUs → Select SKU → Click "Track Order"
     - Step 4: Orders → Show tracking dashboard

### **Quick Demo Flow (5 minutes):**

1. `/demo/telarus` → Click "Internet" tile
2. Scroll to "Top Cross-Sell Opportunities" → Highlight Voice (78%)
3. Scroll to "Regional Performance" → Click "North"
4. Scroll to "Who Should I Go With?" → Show FastFiber recommendation
5. Click "Vendors" → Show vendor recommendations
6. Click "Orders" → Show tracking dashboard

### **Custom Dashboards Demo:**

- Use same paths but with `/demo/telarus/custom` base URL
- Emphasize the custom Vega-Lite visualizations
- Show how it works without Tableau Server access

---

## Notes for the Presenter

- **Practice the flow** - Follow the click paths above before the demo
- **Have data ready** - Know which product/region combinations show good examples
- **Prepare backup** - Have screenshots if live demo fails
- **Know the metrics** - Be ready to discuss performance numbers
- **Read the room** - Adjust technical depth based on audience
- **Time management:**
  - Quick demo: 5 minutes (Products page only)
  - Standard demo: 10-15 minutes (Products + Vendors + Orders)
  - Full demo: 20-25 minutes (Include Advisor Journey)

**Pro Tips:**
- Always select "Internet" as your demo product (has best cross-sell data)
- Use "North" region for supplier recommendations (FastFiber performs well)
- If something doesn't load, have the Advisor Journey as backup (it's more self-contained)
- Custom dashboards are great for showing analytics capabilities without Tableau Server

---

*This script is designed to be adapted based on your audience—more technical for developers, more business-focused for executives.*

