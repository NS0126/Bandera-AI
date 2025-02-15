const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.json());

let mockCompanies = []; // Stores mock companies to pass between commands

// Routes
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  console.log("Received message:", message);

  try {
    // Load JSON Data
    const filePath = path.join(__dirname, 'mockData.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Step 1: Check for Conversational Commands First
    const conversationalCommands = data.filter(item => item.command);
    const matchedCommand = conversationalCommands.find(cmd => message.toLowerCase().includes(cmd.command.toLowerCase()));

    if (matchedCommand) {
      return res.json({ type: 'text', data: matchedCommand.response });
    }

    // Step 2: Handle Data Fetching Commands Separately

    // Find Companies
    if (message.startsWith('Find companies')) {
      mockCompanies = data.filter(item => item.name); // Filter only company objects
      return res.json({ type: 'table', data: mockCompanies });
    }

    // Enrich Those Profiles
    if (message.startsWith('Enrich those profiles')) {
      if (mockCompanies.length === 0) {
        return res.json({ type: 'text', data: 'No companies found. Please use "Find companies" first.' });
      }
      const enrichedProfiles = mockCompanies.map((company, index) => ({
        ...company,
        email: `contact${index + 1}@${company.name.replace(/\s+/g, '').toLowerCase()}.com`,
        phone: `123-456-${String(1000 + index).slice(-4)}`,
        linkedin: `https://linkedin.com/in/${company.name.replace(/\s+/g, '').toLowerCase()}`,
        x: `https://x.com/${company.name.replace(/\s+/g, '').toLowerCase()}`
      }));
      mockCompanies = enrichedProfiles;
      return res.json({ type: 'table', data: enrichedProfiles });
    }

    // Find Work Email
    if (message.startsWith('Find Work Email')) {
      const workEmails = data.filter(item => item.name).map((company) => ({
        name: company.name,
        workEmail: company.workEmail || "Not Available"
      }));
      return res.json({ type: 'table', data: workEmails });
    }

    // Generate Sales Emails
    if (message.startsWith('Generate Sales Emails')) {
      const salesEmails = data.filter(item => item.name).map((company) => ({
        name: company.name,
        salesEmail: company.salesEmail || "Not Available"
      }));
      return res.json({ type: 'table', data: salesEmails });
    }

    // Find CEO of a company
    if (message.startsWith("Find CEO of")) {
      const companyName = message.replace("Find CEO of ", "").trim();
      const company = data.find(item => item.name.toLowerCase() === companyName.toLowerCase());

      if (!company) {
        return res.json({ type: "text", data: `No company found for ${companyName}.` });
      }

      return res.json({
        type: "table",
        data: [{ name: company.name, ceo: company.ceoName, linkedin: company.ceoLinkedIn }]
      });
    }

    // Find competitors of a company
    if (message.startsWith("Find competitors of")) {
      const companyName = message.replace("Find competitors of ", "").trim();
      const company = data.find(item => item.name.toLowerCase() === companyName.toLowerCase());

      if (!company) {
        return res.json({ type: "text", data: `No competitors found for ${companyName}.` });
      }

      return res.json({
        type: "table",
        data: company.competitors.map(comp => ({ competitor: comp }))
      });
    }

    // Find AI companies in {location}
    if (message.startsWith("Find AI companies in")) {
      const location = message.replace("Find AI companies in ", "").trim();
      const aiCompanies = data.filter(item => item.industry === "Artificial Intelligence" && item.location.includes(location));

      if (aiCompanies.length === 0) {
        return res.json({ type: "text", data: `No AI companies found in ${location}.` });
      }

      return res.json({ type: "table", data: aiCompanies });
    }

    // Find job openings at a company
    if (message.startsWith("Find job openings at")) {
      const companyName = message.replace("Find job openings at ", "").trim();
      const company = data.find(item => item.name.toLowerCase() === companyName.toLowerCase());

      if (!company || !company.jobOpenings) {
        return res.json({ type: "text", data: `No job openings found for ${companyName}.` });
      }

      return res.json({ type: "table", data: company.jobOpenings });
    }

    // Find revenue growth for a company
    if (message.startsWith("Find revenue growth for")) {
      const companyName = message.replace("Find revenue growth for ", "").trim();
      const company = data.find(item => item.name.toLowerCase() === companyName.toLowerCase());

      if (!company) {
        return res.json({ type: "text", data: `No revenue data found for ${companyName}.` });
      }

      return res.json({
        type: "table",
        data: [{ name: company.name, revenueGrowth: company.revenueGrowth }]
      });
    }

    // Find investors for a company
    if (message.startsWith("Find investors for")) {
      const companyName = message.replace("Find investors for ", "").trim();
      const company = data.find(item => item.name.toLowerCase() === companyName.toLowerCase());

      if (!company || !company.investors) {
        return res.json({ type: "text", data: `No investors found for ${companyName}.` });
      }

      return res.json({ type: "table", data: company.investors });
    }

    // Unrecognized Command
    res.status(400).json({ type: 'text', data: 'Command not recognized.' });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ type: 'text', data: 'Error processing request.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
