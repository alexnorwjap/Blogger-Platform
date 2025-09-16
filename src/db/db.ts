import { DB } from './db-types';

const db: DB = {
  blogs: [
    {
      id: 1,
      name: 'Tech Insights',
      description:
        'A blog about the latest technology trends, programming tips, and software development insights. We cover everything from AI and machine learning to web development and cybersecurity. Our goal is to help developers and tech enthusiasts stay updated with the rapidly evolving world of technology.',
      websiteUrl: 'https://techinsights.com',
    },
    {
      id: 2,
      name: 'Digital Marketing',
      description:
        'Everything you need to know about digital marketing, SEO, social media, and online advertising strategies. We provide practical tips, case studies, and industry insights to help businesses grow their online presence and reach their target audience effectively.',
      websiteUrl: 'https://digitalmarketing.net',
    },
    {
      id: 3,
      name: 'Healthy Living',
      description:
        'Tips and advice for maintaining a healthy lifestyle, fitness routines, nutrition guides, and wellness practices. Our content is backed by research and written by health professionals to help you make informed decisions about your physical and mental well-being.',
      websiteUrl: 'https://healthyliving.org',
    },
    {
      id: 4,
      name: 'Travel Adventures',
      description:
        'Discover amazing destinations, travel tips, cultural experiences, and adventure stories from around the world. We share budget-friendly travel guides, hidden gems, and practical advice to help you plan unforgettable journeys and create lasting memories.',
      websiteUrl: 'https://traveladventures.com',
    },
    {
      id: 5,
      name: 'Food & Recipes',
      description:
        'Delicious recipes, cooking techniques, restaurant reviews, and culinary adventures for food lovers. From quick weeknight dinners to elaborate holiday feasts, we provide step-by-step instructions and pro tips to help you master the art of cooking.',
      websiteUrl: 'https://foodrecipes.co',
    },
  ],
  posts: [
    {
      id: 1,
      title: 'Mastering Sourdough Bread',
      shortDescription:
        'Learn the secrets to creating perfect sourdough bread at home with this comprehensive guide.',
      content:
        'Sourdough bread making is both an art and a science that has been practiced for thousands of years. The key to success lies in understanding your starter - a living culture of wild yeast and bacteria. Creating a strong, active starter takes patience and consistency, typically requiring daily feeding for 7-10 days. The fermentation process is crucial, as it develops the complex flavors and creates the characteristic tang. Proper kneading and shaping techniques ensure good gluten development and an attractive final product. Baking in a Dutch oven or with steam creates the perfect crust. Temperature and timing are everything - even small changes can dramatically affect the outcome. The reward is a delicious, nutritious bread with a unique flavor profile that commercial yeast simply cannot replicate.',
      blogId: 5,
      blogName: 'Food & Recipes',
    },
    {
      id: 2,
      title: 'Hidden Gems of Southeast Asia',
      shortDescription:
        'Discover breathtaking but lesser-known destinations in Southeast Asia that offer authentic cultural experiences.',
      content:
        "Southeast Asia is a treasure trove of incredible destinations, but beyond the popular tourist spots lie hidden gems waiting to be discovered. Luang Prabang in Laos offers a peaceful retreat with its Buddhist temples and French colonial architecture. The island of Koh Rong Sanloem in Cambodia provides pristine beaches without the crowds. In Vietnam, the mountain town of Sapa offers stunning rice terraces and ethnic minority villages. The Philippines' Palawan province boasts crystal-clear waters and limestone cliffs that rival more famous destinations. Finally, Myanmar's Bagan, with its thousands of ancient temples, offers a spiritual journey through history. These destinations provide authentic experiences while supporting local communities and preserving cultural heritage for future generations.",
      blogId: 4,
      blogName: 'Travel Adventures',
    },
    {
      id: 3,
      title: '10 Essential SEO Strategies',
      shortDescription:
        "Master these proven SEO techniques to boost your website's visibility and organic traffic.",
      content:
        "Search Engine Optimization remains one of the most effective ways to drive organic traffic to your website. In 2024, SEO has evolved significantly with Google's algorithm updates and the rise of AI-powered search. Key strategies include focusing on user experience, creating high-quality content that answers user queries, optimizing for Core Web Vitals, and building authoritative backlinks. Voice search optimization and local SEO are becoming increasingly important. Additionally, with the growing emphasis on E-A-T (Expertise, Authoritativeness, Trustworthiness), businesses need to establish themselves as credible sources in their respective fields. Mobile optimization and page speed are no longer optional but essential for success. The key is to stay updated with algorithm changes and focus on providing genuine value to users.",
      blogId: 2,
      blogName: 'Digital Marketing',
    },
    {
      id: 4,
      title: '5 Morning Routines for Success',
      shortDescription:
        'Start your day right with these simple yet powerful morning habits for better health and productivity.',
      content:
        'Your morning routine sets the tone for the entire day. Research shows that people who follow a consistent morning routine are more productive, less stressed, and generally happier. The key is to start small and build gradually. Begin with waking up at the same time every day, even on weekends. Hydrate immediately upon waking - your body has been without water for 8+ hours. A few minutes of stretching or light exercise can energize your body and mind. Consider meditation or mindfulness practice to center yourself before the day begins. Finally, eat a nutritious breakfast that includes protein, healthy fats, and complex carbohydrates. Remember, consistency is more important than perfection. Small changes can lead to significant improvements over time.',
      blogId: 3,
      blogName: 'Healthy Living',
    },
    {
      id: 5,
      title: 'AI Future in 2024',
      shortDescription:
        'Exploring the latest AI developments and their impact on various industries worldwide.',
      content:
        "Artificial Intelligence continues to evolve at an unprecedented pace. In 2024, we're seeing remarkable advances in machine learning, natural language processing, and computer vision. These technologies are transforming industries from healthcare to finance, creating new opportunities while also raising important questions about ethics and job displacement. Companies are increasingly adopting AI solutions to improve efficiency and customer experience. However, as AI becomes more sophisticated, it's crucial to address concerns about privacy, bias, and the need for proper regulation. The future of AI looks promising, but it requires careful consideration of both its potential and its challenges. We must ensure that AI development remains ethical and beneficial for all of humanity.",
      blogId: 1,
      blogName: 'Tech Insights',
    },
  ],
};

export default db;
