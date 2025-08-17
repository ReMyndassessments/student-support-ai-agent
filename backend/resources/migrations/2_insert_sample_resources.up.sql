-- Behavior Charts
INSERT INTO resources (title, description, category, type, content, tags, concern_types, grade_levels, difficulty_level, estimated_time, materials_needed) VALUES
(
  'Daily Behavior Chart',
  'A simple daily behavior tracking chart for monitoring student progress on specific behaviors.',
  'Behavior Management',
  'Behavior Chart',
  '# Daily Behavior Chart

## Student Information
- **Name:** _______________
- **Date:** _______________
- **Teacher:** _______________

## Target Behaviors
1. **Following Directions**
   - Morning: ⭐ ⭐ ⭐
   - Afternoon: ⭐ ⭐ ⭐
   
2. **Staying in Seat**
   - Morning: ⭐ ⭐ ⭐
   - Afternoon: ⭐ ⭐ ⭐
   
3. **Raising Hand to Speak**
   - Morning: ⭐ ⭐ ⭐
   - Afternoon: ⭐ ⭐ ⭐

## Rating Scale
- ⭐⭐⭐ = Excellent (3 points)
- ⭐⭐ = Good (2 points)
- ⭐ = Needs Improvement (1 point)

## Daily Total: ___/18 points

## Reward Earned: _______________

## Teacher Notes:
_________________________________
_________________________________

## Parent Signature: _______________',
  '["behavior tracking", "daily chart", "star system", "rewards"]',
  '["Behavior", "Social/Emotional"]',
  '["K", "1st", "2nd", "3rd", "4th", "5th"]',
  'beginner',
  '5 minutes setup',
  'Printer, laminator (optional), stickers or stamps'
),
(
  'Weekly Behavior Contract',
  'A comprehensive weekly behavior contract with goals, expectations, and consequences.',
  'Behavior Management',
  'Behavior Chart',
  '# Weekly Behavior Contract

## Student: _______________ Week of: _______________

### My Behavior Goals This Week:
1. ________________________________
2. ________________________________
3. ________________________________

### Daily Check-In
| Day | Goal 1 | Goal 2 | Goal 3 | Teacher Initial | Parent Initial |
|-----|--------|--------|--------|-----------------|----------------|
| Monday | ☐ | ☐ | ☐ | _______ | _______ |
| Tuesday | ☐ | ☐ | ☐ | _______ | _______ |
| Wednesday | ☐ | ☐ | ☐ | _______ | _______ |
| Thursday | ☐ | ☐ | ☐ | _______ | _______ |
| Friday | ☐ | ☐ | ☐ | _______ | _______ |

### Rewards for Meeting Goals:
- **Daily:** ________________________________
- **3 days:** ________________________________
- **5 days:** ________________________________

### If I Do Not Meet My Goals:
- **First time:** ________________________________
- **Second time:** ________________________________
- **Third time:** ________________________________

### Student Signature: _______________
### Teacher Signature: _______________
### Parent Signature: _______________',
  '["behavior contract", "weekly goals", "accountability", "home-school communication"]',
  '["Behavior", "Social/Emotional", "Family/Home"]',
  '["3rd", "4th", "5th", "6th", "7th", "8th"]',
  'intermediate',
  '10 minutes setup',
  'Printer, folder for home-school communication'
);

-- Intervention Templates
INSERT INTO resources (title, description, category, type, content, tags, concern_types, grade_levels, difficulty_level, estimated_time, materials_needed) VALUES
(
  'Check-In/Check-Out System',
  'A structured daily check-in system for students needing additional behavioral support.',
  'Tier 2 Interventions',
  'Intervention Template',
  '# Check-In/Check-Out (CICO) System

## Overview
The Check-In/Check-Out system provides daily structure and feedback for students who need additional behavioral support.

## Implementation Steps

### 1. Morning Check-In (5 minutes)
- Student reports to designated staff member
- Review daily goals and expectations
- Provide encouragement and set positive tone
- Give student their daily point sheet

### 2. Hourly/Class Period Check-Ins
- Teacher rates student performance on target behaviors
- Immediate feedback provided
- Points awarded based on performance

### 3. End-of-Day Check-Out (5 minutes)
- Review daily point sheet with student
- Celebrate successes and discuss challenges
- Send home for parent signature
- Plan for next day

## Daily Point Sheet Template

### Student: _______________ Date: _______________

| Time/Class | Following Directions | Staying on Task | Respectful to Others | Points Earned | Teacher Initial |
|------------|---------------------|-----------------|---------------------|---------------|-----------------|
| Period 1 | 0 1 2 | 0 1 2 | 0 1 2 | ___/6 | _______ |
| Period 2 | 0 1 2 | 0 1 2 | 0 1 2 | ___/6 | _______ |
| Period 3 | 0 1 2 | 0 1 2 | 0 1 2 | ___/6 | _______ |
| Period 4 | 0 1 2 | 0 1 2 | 0 1 2 | ___/6 | _______ |
| Period 5 | 0 1 2 | 0 1 2 | 0 1 2 | ___/6 | _______ |

### Daily Total: ___/30 points (Goal: 80% = 24 points)

### Goal Met: ☐ Yes ☐ No
### Reward Earned: _______________

## Staff Roles
- **Check-in/Check-out Coordinator:** _______________
- **Backup Staff:** _______________

## Data Collection
- Track daily point totals
- Calculate weekly averages
- Review progress monthly
- Adjust goals as needed',
  '["CICO", "daily check-in", "behavior support", "tier 2", "data tracking"]',
  '["Behavior", "Social/Emotional", "Academic"]',
  '["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]',
  'intermediate',
  '15 minutes daily',
  'Point sheets, clipboard, timer, small rewards'
),
(
  'Academic Support Plan',
  'A comprehensive template for creating individualized academic support plans.',
  'Academic Support',
  'Intervention Template',
  '# Academic Support Plan

## Student Information
- **Name:** _______________
- **Grade:** _______________
- **Teacher:** _______________
- **Date Created:** _______________

## Areas of Concern
☐ Reading Comprehension
☐ Reading Fluency
☐ Math Computation
☐ Math Problem Solving
☐ Writing
☐ Organization
☐ Attention/Focus
☐ Other: _______________

## Current Performance Level
### Academic Skills Assessment
- **Reading Level:** _______________
- **Math Level:** _______________
- **Writing Level:** _______________

### Strengths
1. ________________________________
2. ________________________________
3. ________________________________

### Areas for Growth
1. ________________________________
2. ________________________________
3. ________________________________

## Intervention Strategies

### Reading Support
- ☐ Small group instruction
- ☐ Peer tutoring
- ☐ Audio books
- ☐ Graphic organizers
- ☐ Extended time
- ☐ Other: _______________

### Math Support
- ☐ Manipulatives
- ☐ Calculator use
- ☐ Step-by-step guides
- ☐ Visual aids
- ☐ Extra practice time
- ☐ Other: _______________

### Writing Support
- ☐ Graphic organizers
- ☐ Word processing
- ☐ Spell check
- ☐ Sentence starters
- ☐ Peer editing
- ☐ Other: _______________

## Accommodations
### Presentation
- ☐ Large print materials
- ☐ Audio instructions
- ☐ Visual cues
- ☐ Simplified language
- ☐ Other: _______________

### Response
- ☐ Oral responses
- ☐ Multiple choice vs. essay
- ☐ Use of technology
- ☐ Alternative formats
- ☐ Other: _______________

### Setting
- ☐ Quiet space
- ☐ Small group
- ☐ Preferential seating
- ☐ Reduced distractions
- ☐ Other: _______________

### Timing
- ☐ Extended time
- ☐ Frequent breaks
- ☐ Flexible scheduling
- ☐ Shorter assignments
- ☐ Other: _______________

## Progress Monitoring
- **Frequency:** _______________
- **Method:** _______________
- **Data Collection:** _______________
- **Review Date:** _______________

## Success Criteria
1. ________________________________
2. ________________________________
3. ________________________________

## Team Members
- **Student:** _______________
- **Teacher:** _______________
- **Parent/Guardian:** _______________
- **Support Staff:** _______________
- **Administrator:** _______________',
  '["academic support", "intervention plan", "accommodations", "progress monitoring"]',
  '["Academic", "Attention"]',
  '["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]',
  'advanced',
  '30 minutes setup',
  'Assessment data, meeting space, progress monitoring tools'
);

-- Accommodation Strategies
INSERT INTO resources (title, description, category, type, content, tags, concern_types, grade_levels, difficulty_level, estimated_time, materials_needed) VALUES
(
  'Sensory Break Strategies',
  'A collection of sensory break activities and strategies for students with sensory processing needs.',
  'Accommodations',
  'Strategy Guide',
  '# Sensory Break Strategies

## Overview
Sensory breaks help students regulate their sensory systems and improve focus and attention.

## Calming Strategies (When Overstimulated)

### Deep Pressure Activities
- Wall push-ups (10-15 repetitions)
- Chair push-ups
- Carrying heavy books or supplies
- Weighted lap pad or blanket
- Bear hugs or tight squeezes

### Proprioceptive Input
- Jumping jacks
- Marching in place
- Yoga poses (child pose, downward dog)
- Stretching exercises
- Heavy work tasks (moving desks, organizing supplies)

### Calming Sensory Tools
- Stress balls or fidgets
- Noise-canceling headphones
- Calm-down corner with soft lighting
- Essential oils (lavender, peppermint)
- Breathing exercises

## Alerting Strategies (When Under-Stimulated)

### Movement Activities
- Quick walk around the classroom
- Jumping on a mini trampoline
- Dance or movement songs
- Balancing activities
- Obstacle course

### Tactile Input
- Textured materials (sandpaper, fabric)
- Play dough or therapy putty
- Vibrating tools or toys
- Cold or warm objects
- Different textures to touch

### Alerting Sensory Tools
- Chewing gum or crunchy snacks
- Peppermint scent
- Bright lighting
- Upbeat music
- Visual stimulation

## Implementation Guidelines

### Creating a Sensory Break Schedule
1. **Identify triggers** - When does the student need breaks?
2. **Set regular intervals** - Every 20-30 minutes or as needed
3. **Choose appropriate activities** - Match to student needs
4. **Monitor effectiveness** - Track what works best

### Sensory Break Card System
Create cards with different activities:
- **Red Card:** Calming activities
- **Yellow Card:** Organizing activities  
- **Green Card:** Alerting activities

### Environmental Modifications
- Quiet corner with soft seating
- Fidget basket with various tools
- Movement area with yoga mats
- Sensory bin with different textures
- Noise-reducing materials

## Sample Sensory Break Menu

### 2-Minute Breaks
- Deep breathing (4-7-8 technique)
- Desk push-ups
- Fidget with stress ball
- Listen to calming music

### 5-Minute Breaks
- Walk to water fountain
- Organize classroom supplies
- Stretching routine
- Sensory bin exploration

### 10-Minute Breaks
- Visit sensory room
- Complete movement circuit
- Art therapy activity
- Mindfulness exercise

## Data Collection
Track the following:
- Time of day breaks are needed
- Type of activity chosen
- Duration of break
- Effectiveness (1-5 scale)
- Return to task behavior

## Tips for Success
1. **Teach self-advocacy** - Help students recognize their needs
2. **Be proactive** - Offer breaks before meltdowns occur
3. **Stay consistent** - Use the same strategies regularly
4. **Involve the student** - Let them choose preferred activities
5. **Communicate with team** - Share what works across settings',
  '["sensory breaks", "self-regulation", "calming strategies", "movement", "proprioceptive"]',
  '["Behavior", "Social/Emotional", "Attention"]',
  '["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]',
  'intermediate',
  '10 minutes setup',
  'Fidget tools, yoga mats, timer, sensory materials, quiet space'
),
(
  'Reading Comprehension Supports',
  'Evidence-based strategies and accommodations for improving reading comprehension.',
  'Accommodations',
  'Strategy Guide',
  '# Reading Comprehension Supports

## Pre-Reading Strategies

### Activate Prior Knowledge
- **KWL Charts:** What I Know, Want to know, Learned
- **Picture Walks:** Preview images and make predictions
- **Vocabulary Preview:** Introduce key terms before reading
- **Text Structure Preview:** Identify genre and text features

### Set Purpose for Reading
- Provide specific questions to answer
- Give a reading goal or mission
- Use graphic organizers to focus attention
- Create anticipation guides

## During Reading Strategies

### Comprehension Monitoring
- **Think-Alouds:** Model thinking process
- **Stop and Check:** Pause to summarize
- **Question Generation:** Student creates questions
- **Visualization:** Draw or describe mental images

### Text Interaction
- **Annotation:** Highlight, underline, make notes
- **Sticky Note Strategy:** Mark important parts
- **Reading Guides:** Structured note-taking
- **Partner Reading:** Read with a buddy

## Post-Reading Strategies

### Comprehension Check
- **Retelling:** Summarize in own words
- **Story Maps:** Identify key elements
- **Main Idea/Details:** Organize information
- **Compare/Contrast:** Analyze relationships

### Extension Activities
- **Creative Response:** Art, drama, writing
- **Real-World Connections:** Link to student experience
- **Research Projects:** Explore related topics
- **Book Talks:** Share with others

## Accommodations by Reading Level

### Emerging Readers
- Audio books with text highlighting
- Picture books with complex themes
- Shared reading experiences
- Simplified text versions
- Visual vocabulary supports

### Developing Readers
- Graphic novels and illustrated texts
- Chapter books with pictures
- Reading guides and organizers
- Partner or small group reading
- Choice in reading materials

### Fluent Readers
- Complex texts with supports
- Multiple text formats
- Independent research projects
- Literature circles
- Critical thinking questions

## Graphic Organizers

### Story Elements Map
```
Title: ________________
Characters: ___________
Setting: ______________
Problem: _____________
Solution: _____________
```

### Main Idea Web
```
        Detail
           |
Detail - Main Idea - Detail
           |
        Detail
```

### Cause and Effect Chain
```
Cause → Effect → Cause → Effect
```

### Compare and Contrast Venn Diagram
```
   Text 1    Both    Text 2
     |        |        |
  [____]  [______]  [____]
```

## Technology Supports

### Reading Apps and Tools
- **Text-to-Speech:** Natural Reader, Voice Dream
- **Annotation Tools:** Kami, Adobe Acrobat
- **Vocabulary Support:** Vocabulary.com, Quizlet
- **Comprehension Games:** Reading A-Z, Epic Books

### Digital Graphic Organizers
- Lucidchart for concept mapping
- Padlet for collaborative boards
- Google Drawings for visual organizers
- Flipgrid for video responses

## Assessment Accommodations

### Alternative Response Formats
- Oral responses instead of written
- Multiple choice vs. open-ended
- Visual representations
- Technology-assisted responses
- Portfolio-based assessment

### Modified Expectations
- Shorter passages
- Reduced number of questions
- Extended time
- Frequent breaks
- Simplified language

## Progress Monitoring Tools

### Running Records
- Track reading accuracy
- Note comprehension strategies used
- Identify error patterns
- Plan targeted instruction

### Comprehension Rubrics
- Rate understanding levels
- Track strategy use
- Monitor growth over time
- Guide instruction planning

## Implementation Tips

1. **Start Small:** Introduce one strategy at a time
2. **Model First:** Show students how to use strategies
3. **Practice Together:** Guided practice before independence
4. **Provide Choice:** Let students select preferred strategies
5. **Monitor Progress:** Regular check-ins and adjustments
6. **Celebrate Success:** Acknowledge growth and effort',
  '["reading comprehension", "graphic organizers", "text strategies", "accommodations"]',
  '["Academic", "Attention"]',
  '["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]',
  'intermediate',
  '15 minutes setup',
  'Graphic organizers, sticky notes, highlighters, reading materials'
);

-- Educational Materials
INSERT INTO resources (title, description, category, type, content, tags, concern_types, grade_levels, difficulty_level, estimated_time, materials_needed) VALUES
(
  'Social Skills Lesson Plans',
  'Structured lesson plans for teaching essential social skills to students.',
  'Educational Materials',
  'Lesson Plan',
  '# Social Skills Lesson Plans

## Lesson 1: Making Friends

### Objective
Students will learn and practice appropriate ways to initiate friendships.

### Materials Needed
- Social skills cards
- Role-play scenarios
- Friendship recipe worksheet
- Chart paper

### Lesson Structure (30 minutes)

#### Introduction (5 minutes)
- Discuss what makes a good friend
- Share personal friendship experiences
- Introduce lesson objective

#### Direct Instruction (10 minutes)
**Steps to Making Friends:**
1. **Look for someone who seems friendly**
   - Smiling, open body language
   - Playing alone or in small groups
   - Seems approachable

2. **Approach with confidence**
   - Walk up with a smile
   - Make eye contact
   - Use a friendly voice

3. **Start a conversation**
   - "Hi, I am [name]. What is your name?"
   - "What are you doing? Can I join?"
   - "I like your [item]. Where did you get it?"

4. **Show interest**
   - Ask questions about their interests
   - Listen to their responses
   - Share something about yourself

5. **Suggest an activity**
   - "Want to play [game] together?"
   - "Would you like to sit with me at lunch?"
   - "Do you want to be partners?"

#### Guided Practice (10 minutes)
- Role-play scenarios with teacher guidance
- Practice conversation starters
- Discuss what to do if someone says no

#### Independent Practice (5 minutes)
- Complete "Friendship Recipe" worksheet
- Partner practice with classmates
- Plan to try one new friendship skill today

### Assessment
- Observe student participation in role-plays
- Review completed worksheets
- Check for understanding through questioning

### Extension Activities
- Create friendship books
- Practice during recess
- Share friendship success stories

---

## Lesson 2: Conflict Resolution

### Objective
Students will learn peaceful ways to resolve conflicts with peers.

### Materials Needed
- Conflict resolution steps poster
- Problem scenario cards
- Peace table or designated area
- Timer

### Lesson Structure (30 minutes)

#### Introduction (5 minutes)
- Discuss what conflict means
- Share examples of common conflicts
- Explain importance of peaceful solutions

#### Direct Instruction (10 minutes)
**Steps to Resolve Conflicts:**
1. **Stop and Cool Down**
   - Take three deep breaths
   - Count to ten
   - Walk away if needed

2. **Use "I" Statements**
   - "I feel [emotion] when [behavior]"
   - "I need [what you want]"
   - Avoid blame and accusations

3. **Listen to the Other Person**
   - Make eye contact
   - Do not interrupt
   - Try to understand their perspective

4. **Find a Solution Together**
   - Brainstorm ideas
   - Choose something fair for both
   - Agree to try the solution

5. **Get Help if Needed**
   - Ask a teacher or adult
   - Use peer mediators
   - Take a longer break

#### Guided Practice (10 minutes)
- Model conflict resolution with scenarios
- Practice "I" statements
- Role-play with teacher support

#### Independent Practice (5 minutes)
- Work in pairs to solve practice scenarios
- Create personal conflict resolution plan
- Discuss when to ask for adult help

### Assessment
- Observe use of conflict resolution steps
- Listen to "I" statement practice
- Check scenario solutions for appropriateness

---

## Lesson 3: Showing Empathy

### Objective
Students will recognize emotions in others and respond with empathy.

### Materials Needed
- Emotion cards or pictures
- Mirrors
- Empathy scenarios
- Feelings thermometer

### Lesson Structure (30 minutes)

#### Introduction (5 minutes)
- Define empathy as understanding others feelings
- Discuss why empathy is important
- Share examples of empathetic responses

#### Direct Instruction (10 minutes)
**How to Show Empathy:**
1. **Notice Body Language**
   - Facial expressions
   - Posture and gestures
   - Voice tone

2. **Listen Carefully**
   - Pay attention to words
   - Notice what is not being said
   - Ask clarifying questions

3. **Reflect Their Feelings**
   - "It sounds like you are feeling..."
   - "That must have been..."
   - "I can see why you would feel..."

4. **Offer Support**
   - "Is there anything I can do to help?"
   - "Would you like to talk about it?"
   - "I am here for you"

#### Guided Practice (10 minutes)
- Practice reading facial expressions
- Use mirrors to show different emotions
- Respond to empathy scenarios as a group

#### Independent Practice (5 minutes)
- Partner practice with emotion cards
- Create empathy response cards
- Plan to notice others feelings today

### Assessment
- Observe emotion recognition accuracy
- Listen to empathetic responses
- Check understanding through discussion

## Implementation Guidelines

### Frequency
- Teach one lesson per week
- Review skills daily
- Practice during natural opportunities

### Reinforcement
- Praise specific social skill use
- Create social skills certificates
- Share success stories with class

### Generalization
- Practice in multiple settings
- Involve other school staff
- Send home practice activities
- Connect to literature and current events

### Data Collection
- Track skill demonstration
- Note peer interactions
- Monitor conflict frequency
- Assess friendship development',
  '["social skills", "friendship", "conflict resolution", "empathy", "lesson plans"]',
  '["Social/Emotional", "Peer Relationships", "Behavior"]',
  '["K", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"]',
  'intermediate',
  '30 minutes per lesson',
  'Social skills cards, role-play props, worksheets, chart paper'
),
(
  'Executive Function Strategies',
  'Practical strategies and tools for supporting students with executive function challenges.',
  'Educational Materials',
  'Strategy Guide',
  '# Executive Function Strategies

## Understanding Executive Function

Executive function skills include:
- **Working Memory:** Holding information in mind
- **Cognitive Flexibility:** Switching between tasks/ideas
- **Inhibitory Control:** Stopping inappropriate responses
- **Planning:** Organizing steps to reach a goal
- **Organization:** Keeping materials and ideas organized
- **Time Management:** Understanding and managing time

## Organization Strategies

### Physical Organization
**Desk/Workspace Setup:**
- Color-coded folders for each subject
- Designated spots for supplies
- Clear containers for visibility
- Labels with words and pictures
- Daily clean-up routine

**Backpack Organization:**
- Separate compartments for different items
- Checklist taped inside backpack
- Homework folder that goes home daily
- Emergency supplies kit
- Weekly backpack cleanout

**Locker Organization:**
- Magnetic organizers and shelves
- Mirror for self-checking
- Schedule taped to door
- Extra supplies stored
- Locker buddy system

### Digital Organization
**File Management:**
- Consistent naming conventions
- Folder structure by subject
- Cloud storage for accessibility
- Regular file cleanup
- Backup systems

**Email Organization:**
- Folders for different purposes
- Unsubscribe from unnecessary lists
- Regular inbox cleaning
- Important email flagging
- Auto-reply for assignments

## Time Management Strategies

### Visual Schedules
**Daily Schedule:**
```
8:00 AM - Arrival/Morning Work
8:30 AM - Math
9:30 AM - Reading
10:30 AM - Snack/Break
10:45 AM - Science
11:45 AM - Lunch
12:30 PM - Social Studies
1:30 PM - Specials
2:30 PM - Writing
3:15 PM - Pack Up/Dismissal
```

**Assignment Timeline:**
```
Week 1: Research and outline
Week 2: First draft
Week 3: Revisions
Week 4: Final draft and presentation
```

### Time Awareness Tools
- Analog clocks with colored sections
- Digital timers with visual countdown
- Time estimation practice
- "Time left" warnings
- Break time scheduling

## Planning and Goal Setting

### Project Planning Template
```
Project: ________________
Due Date: _______________

Step 1: _________________ Due: _______
Step 2: _________________ Due: _______
Step 3: _________________ Due: _______
Step 4: _________________ Due: _______

Materials Needed:
- ____________________
- ____________________
- ____________________

Potential Obstacles:
- ____________________
- ____________________

Help Needed From:
- ____________________
```

### SMART Goals Framework
- **Specific:** What exactly will be accomplished?
- **Measurable:** How will progress be measured?
- **Achievable:** Is this goal realistic?
- **Relevant:** Why is this goal important?
- **Time-bound:** When will this be completed?

## Working Memory Supports

### Memory Strategies
**Chunking Information:**
- Break large tasks into smaller steps
- Group related information together
- Use acronyms and mnemonics
- Create visual associations
- Practice retrieval regularly

**External Memory Aids:**
- Sticky note reminders
- Voice recordings
- Photo documentation
- Checklists and templates
- Digital reminders

### Reducing Cognitive Load
- Provide written instructions
- Break down multi-step directions
- Use visual supports
- Eliminate distractions
- Allow processing time

## Self-Monitoring Tools

### Behavior Tracking
**Daily Self-Check:**
```
Did I:
☐ Bring all materials to class?
☐ Follow directions the first time?
☐ Stay organized during work time?
☐ Turn in completed assignments?
☐ Use my time wisely?

Rating: 😊 😐 😞
```

### Reflection Questions
- What went well today?
- What was challenging?
- What would I do differently?
- What help do I need tomorrow?
- How can I improve?

## Technology Tools

### Apps for Organization
- **Google Calendar:** Schedule management
- **Todoist:** Task management
- **Evernote:** Note organization
- **Forest:** Focus and time management
- **Cozi:** Family organization

### Apps for Time Management
- **Time Timer:** Visual countdown
- **30/30:** Task timing
- **RescueTime:** Time tracking
- **Focus Keeper:** Pomodoro technique
- **Clockify:** Time logging

## Classroom Accommodations

### Environmental Modifications
- Reduced visual distractions
- Quiet work spaces
- Flexible seating options
- Organization stations
- Clear sight lines to teacher

### Instructional Accommodations
- Extended time for assignments
- Frequent check-ins
- Simplified directions
- Visual schedules
- Advance notice of changes

### Assessment Accommodations
- Extended time for tests
- Frequent breaks
- Alternative response formats
- Use of organizational tools
- Reduced number of items

## Teaching Executive Function Skills

### Explicit Instruction
1. **Explain** the skill and why it is important
2. **Model** the skill in action
3. **Practice** together with guidance
4. **Apply** independently with support
5. **Reflect** on effectiveness and adjust

### Scaffolding Support
- Start with high support
- Gradually reduce assistance
- Provide just enough help
- Encourage independence
- Celebrate progress

## Home-School Collaboration

### Communication Tools
- Daily communication log
- Weekly progress reports
- Strategy sharing between settings
- Consistent expectations
- Regular team meetings

### Parent Support Strategies
- Homework organization systems
- Evening routine structures
- Weekend planning sessions
- Summer skill maintenance
- Advocacy training

## Progress Monitoring

### Data Collection
- Executive function rating scales
- Work sample analysis
- Time-on-task observations
- Goal achievement tracking
- Student self-assessments

### Review and Adjustment
- Monthly progress reviews
- Strategy effectiveness evaluation
- Goal modification as needed
- New skill introduction
- Celebration of growth',
  '["executive function", "organization", "time management", "planning", "working memory"]',
  '["Academic", "Attention", "Organization"]',
  '["3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]',
  'advanced',
  '20 minutes setup',
  'Timers, organizers, checklists, calendars, technology tools'
);
