import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create flat group
app.post('/make-server-931651d3/groups', async (c) => {
  try {
    const { name, creatorId, creatorData } = await c.req.json();
    
    const groupId = `group_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const groupData = {
      id: groupId,
      name,
      createdAt: new Date().toISOString(),
      members: [{ id: creatorId, ...creatorData, role: 'admin' }],
      mealPlan: null,
      settings: {
        lunchDeadline: '10:00',
        dinnerDeadline: '16:00'
      }
    };
    
    await kv.set(`group:${groupId}`, groupData);
    await kv.set(`user:${creatorId}:group`, groupId);
    
    return c.json({ success: true, groupId, groupData });
  } catch (error) {
    console.log('Error creating group:', error);
    return c.json({ error: 'Failed to create group' }, 500);
  }
});

// Join flat group
app.post('/make-server-931651d3/groups/:groupId/join', async (c) => {
  try {
    const groupId = c.req.param('groupId');
    const { userId, userData } = await c.req.json();
    
    const group = await kv.get(`group:${groupId}`);
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }
    
    // Add member to group
    group.members.push({ id: userId, ...userData, role: 'member' });
    await kv.set(`group:${groupId}`, group);
    await kv.set(`user:${userId}:group`, groupId);
    
    return c.json({ success: true, group });
  } catch (error) {
    console.log('Error joining group:', error);
    return c.json({ error: 'Failed to join group' }, 500);
  }
});

// Get user's group data
app.get('/make-server-931651d3/user/:userId/group', async (c) => {
  try {
    const userId = c.req.param('userId');
    const groupId = await kv.get(`user:${userId}:group`);
    
    if (!groupId) {
      return c.json({ group: null });
    }
    
    const group = await kv.get(`group:${groupId}`);
    return c.json({ group });
  } catch (error) {
    console.log('Error getting user group:', error);
    return c.json({ error: 'Failed to get group' }, 500);
  }
});

// Generate meal plan based on group preferences
app.post('/make-server-931651d3/groups/:groupId/generate-plan', async (c) => {
  try {
    const groupId = c.req.param('groupId');
    const group = await kv.get(`group:${groupId}`);
    
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }
    
    // Get all members' favorite dishes and dietary preferences
    const vegMembers = group.members.filter(m => m.dietType === 'veg');
    const hasVegMembers = vegMembers.length > 0;
    
    // Collect all favorite dishes based on group diet preferences
    let availableDishes = [];
    group.members.forEach(member => {
      if (member.favoriteDishes) {
        availableDishes.push(...member.favoriteDishes);
      }
    });
    
    // Remove duplicates and filter based on group diet needs
    availableDishes = [...new Set(availableDishes)];
    
    // If there are veg members, prioritize veg dishes
    if (hasVegMembers) {
      const vegDishes = availableDishes.filter(dish => 
        !dish.includes('Chicken') && !dish.includes('Fish') && 
        !dish.includes('Mutton') && !dish.includes('Egg') && 
        !dish.includes('Prawn')
      );
      
      // Use mostly veg dishes with occasional non-veg for non-veg members
      availableDishes = [...vegDishes, ...vegDishes, ...availableDishes.filter(d => !vegDishes.includes(d))];
    }
    
    // Generate 6-day meal plan
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const mealPlan: any = {};
    
    const shuffled = [...availableDishes].sort(() => Math.random() - 0.5);
    
    weekDays.forEach((day, index) => {
      mealPlan[day] = {
        lunch: shuffled[index * 2] || availableDishes[0] || "Dal Chawal 🍛",
        dinner: shuffled[index * 2 + 1] || availableDishes[1] || "Rajma Chawal 🍛"
      };
    });
    
    // Save meal plan
    group.mealPlan = {
      ...mealPlan,
      generatedAt: new Date().toISOString(),
      locked: false
    };
    
    await kv.set(`group:${groupId}`, group);
    
    return c.json({ success: true, mealPlan: group.mealPlan });
  } catch (error) {
    console.log('Error generating meal plan:', error);
    return c.json({ error: 'Failed to generate meal plan' }, 500);
  }
});

// Lock meal plan
app.post('/make-server-931651d3/groups/:groupId/lock-plan', async (c) => {
  try {
    const groupId = c.req.param('groupId');
    const group = await kv.get(`group:${groupId}`);
    
    if (!group) {
      return c.json({ error: 'Group not found' }, 404);
    }
    
    if (group.mealPlan) {
      group.mealPlan.locked = true;
      group.mealPlan.lockedAt = new Date().toISOString();
    }
    
    await kv.set(`group:${groupId}`, group);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error locking meal plan:', error);
    return c.json({ error: 'Failed to lock meal plan' }, 500);
  }
});

// Submit daily headcount
app.post('/make-server-931651d3/groups/:groupId/headcount', async (c) => {
  try {
    const groupId = c.req.param('groupId');
    const { userId, date, lunch, dinner } = await c.req.json();
    
    const headcountKey = `headcount:${groupId}:${date}`;
    let headcount = await kv.get(headcountKey) || {};
    
    headcount[userId] = { lunch, dinner, submittedAt: new Date().toISOString() };
    
    await kv.set(headcountKey, headcount);
    
    return c.json({ success: true, headcount });
  } catch (error) {
    console.log('Error submitting headcount:', error);
    return c.json({ error: 'Failed to submit headcount' }, 500);
  }
});

// Get daily headcount summary
app.get('/make-server-931651d3/groups/:groupId/headcount/:date', async (c) => {
  try {
    const groupId = c.req.param('groupId');
    const date = c.req.param('date');
    
    const group = await kv.get(`group:${groupId}`);
    const headcountData = await kv.get(`headcount:${groupId}:${date}`) || {};
    
    // Calculate totals and roti counts
    let lunchCount = 0;
    let dinnerCount = 0;
    let lunchRotis = 0;
    let dinnerRotis = 0;
    
    Object.entries(headcountData).forEach(([userId, data]: [string, any]) => {
      const member = group.members.find((m: any) => m.id === userId);
      const rotiCount = member?.rotiCount || 3;
      
      if (data.lunch) {
        lunchCount++;
        lunchRotis += rotiCount;
      }
      if (data.dinner) {
        dinnerCount++;
        dinnerRotis += rotiCount;
      }
    });
    
    // Get today's meals from meal plan
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const todaysMeals = group.mealPlan?.[dayName] || { lunch: "Dal Chawal 🍛", dinner: "Rajma Chawal 🍛" };
    
    return c.json({
      lunch: {
        dish: todaysMeals.lunch,
        people: lunchCount,
        rotis: lunchRotis
      },
      dinner: {
        dish: todaysMeals.dinner,
        people: dinnerCount,
        rotis: dinnerRotis
      }
    });
  } catch (error) {
    console.log('Error getting headcount summary:', error);
    return c.json({ error: 'Failed to get headcount summary' }, 500);
  }
});

// Send cook notification (mock WhatsApp)
app.post('/make-server-931651d3/groups/:groupId/notify-cook', async (c) => {
  try {
    const groupId = c.req.param('groupId');
    const { date, summary } = await c.req.json();
    
    // In real implementation, this would integrate with WhatsApp Business API
    const message = `🍽️ *FlatMeals Order for ${date}*

🌞 *Lunch: ${summary.lunch.dish}*
👥 People: ${summary.lunch.people}
🥖 Rotis: ${summary.lunch.rotis}

🌙 *Dinner: ${summary.dinner.dish}*
👥 People: ${summary.dinner.people}
🥖 Rotis: ${summary.dinner.rotis}

Thanks! 🙏`;
    
    // Store notification log
    const notificationKey = `notification:${groupId}:${date}`;
    await kv.set(notificationKey, {
      message,
      sentAt: new Date().toISOString(),
      summary
    });
    
    return c.json({ success: true, message });
  } catch (error) {
    console.log('Error sending cook notification:', error);
    return c.json({ error: 'Failed to send notification' }, 500);
  }
});

Deno.serve(app.fetch);