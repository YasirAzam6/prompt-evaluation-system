# Prompt Engineering Evaluation

| Strategy | Avg Score |
|---|---|
| A | 0.95 |
| B | 0.99 |
| C | 0.81 |
| D | 0.85 |

## Sample Outputs

### Strategy A
**Q:** Explain in 2–3 simple steps how I can set up OmniServe to handle support tickets automatically.

**A:**
```
Sure! Here’s how to set up OmniServe for automatic support ticket handling:

1. **Connect Channels**: Link all your customer communication channels (email, chat, social media) to OmniServe.
2. **Set Rules**: Define rules for ticket categorization and prioritization based on keywords or customer details.
3. **Automate Responses**: Create templates for common issues to allow OmniServe to respond automatically. 

Would you like more detailed instructions on any step?
```

**Q:** How do I connect Lucidya Omnichannel with both WhatsApp and Twitter at the same time?

**A:**
```
To connect Lucidya Omnichannel with both WhatsApp and Twitter, follow these steps:

1. **Access Settings:** Log in to Lucidya and go to the Omnichannel settings.
2. **Connect WhatsApp and Twitter:** Follow the prompts to connect each platform. You'll need to authorize access for both WhatsApp and Twitter.
3. **Verify Integration:** Ensure both platforms are successfully integrated by checking for incoming messages in Lucidya.

Do you have access to your account settings?
```


### Strategy B
**Q:** Explain in 2–3 simple steps how I can set up OmniServe to handle support tickets automatically.

**A:**
```
Short answer: Set up OmniServe to auto-handle tickets by integrating channels and defining rules.

Steps:
1. Integrate your communication channels (email, chat) with OmniServe.
2. Define rules for automatic ticket creation and routing.
3. Set automated responses for common issues.

Tip: Use predefined templates for frequent questions to save time.
```

**Q:** How do I connect Lucidya Omnichannel with both WhatsApp and Twitter at the same time?

**A:**
```
Short answer: Connect both platforms through Lucidya Omnichannel's integration settings.

Steps:
1. Open Lucidya Omnichannel dashboard.
2. Go to Integration settings.
3. Select WhatsApp and follow the connection instructions.
4. Select Twitter and follow the connection instructions.

Tip: Ensure you have the necessary permissions and API keys for both platforms.
```


### Strategy C
**Q:** Explain in 2–3 simple steps how I can set up OmniServe to handle support tickets automatically.

**A:**
```
A: Short answer: Configure OmniServe's automation settings to route and respond to tickets.

   Steps:
    1. Access OmniServe settings and find the "Automation" section.
    2. Set rules to assign tickets to specific agents or teams automatically.
    3. Create templates for common inquiries to enable automatic responses.

   Tip: Regularly review and update rules to improve efficiency.
```

**Q:** How do I connect Lucidya Omnichannel with both WhatsApp and Twitter at the same time?

**A:**
```
A: Short answer: Use the integration settings to connect both platforms.
   Steps:
    1. Go to Integration Settings in Lucidya Omnichannel.
    2. Select "Add Platform" and choose WhatsApp.
    3. Follow the prompts to authorize and connect your WhatsApp account.
    4. Repeat the process for Twitter by selecting "Add Platform" again and choosing Twitter.
    5. Authorize and connect your Twitter account.
   Tip: Ensure you have the necessary permissions and account details ready for both platforms.
```


### Strategy D
**Q:** Explain in 2–3 simple steps how I can set up OmniServe to handle support tickets automatically.

**A:**
```
Sure! Here’s how you can set up OmniServe to handle support tickets automatically:

1. **Integrate Communication Channels**: Connect all your customer communication channels (email, chat, social media) to OmniServe. This centralizes incoming tickets for streamlined management.
   
2. **Configure Automation Rules**: Set up rules to automatically categorize, prioritize, and assign tickets to the appropriate team members based on keywords or other criteria.

3. **Monitor and Adjust**: Regularly review ticket handling performance and adjust rules as needed to improve response times and resolution efficiency.

Would you like more detailed guidance on any of these steps?
```

**Q:** How do I connect Lucidya Omnichannel with both WhatsApp and Twitter at the same time?

**A:**
```
To connect Lucidya Omnichannel with both WhatsApp and Twitter, you need to integrate each platform within the Omnichannel settings. 

1. **WhatsApp Integration:**
   - Access the Omnichannel dashboard.
   - Navigate to the integrations section.
   - Select WhatsApp and follow the prompts to authenticate and link your account.

2. **Twitter Integration:**
   - In the same integrations section, select Twitter.
   - Authenticate your Twitter account and provide necessary permissions.

Once both platforms are linked, Lucidya Omnichannel will start gathering and analyzing data from these channels. 

Example: After integration, you can manage customer interactions from WhatsApp and Twitter in one unified dashboard.
```


## Summary Insights
**Best Strategy:** B

**Why it works better:** Strategy B consistently returned concise, actionable answers in the same language as the user query.

**Trade-offs:**
- Cost: Strategies with few-shot examples or long prompts → slightly higher token usage.
- Speed: More complex prompts → slower response.
- Complexity: Structured prompts require careful formatting; zero-shot → simplest.
