import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@zoroaster/shared';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
type HomepageContentItem = {
  id: string;
  created_at: string;
  title?: string;
  content: string;
  section: string;
};
type Post = {
  id: string;
  title: string;
  content: string;
  slug: string;
  created_at: string;
};
type ReleaseItem = {
  id: string;
  created_at: string;
  title: string;
  type: string;
  link?: string;
};

// --- DATA FETCHING FUNCTIONS ---
const fetchHomepageContent = async (): Promise<HomepageContentItem[]> => {
  const { data, error } = await supabase.from('homepage_content').select('*');
  if (error) throw new Error(error.message);
  return data as HomepageContentItem[];
};
const fetchLatestPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, content, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);
  if (error) throw new Error(error.message);
  return data as Post[];
};
const fetchReleaseItems = async (): Promise<ReleaseItem[]> => {
  const { data, error } = await supabase.from('release_items').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as ReleaseItem[];
};

// --- NEW DUAL SCROLLING TEXT PROPHECY COMPONENT ---
const DualScrollingProphecy: React.FC<{ spinsLeft: number, setSpinsLeft: React.Dispatch<React.SetStateAction<number>> }> = ({ spinsLeft, setSpinsLeft }) => {
    const englishReelRef = useRef<HTMLDivElement>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const itemHeight = 150; // Must match .prophecyItem height in CSS

    const fortunes = [
        { english: "Your heart is a compass that always points toward love—trust it, follow it, honor it." },
        { english: "You are not who you were yesterday unless you choose to be—each day offers the gift of becoming." },
        { english: "The friend of truth shall be the friend of my spirit, O Ahura Mazda. (Yasna 46.2)" },
        { english: "Every moment is sacred when approached with reverence, every task holy when performed with love." },
        { english: "The mind aligned with truth thinks God's thoughts after Him, sees with divine eyes, loves with cosmic heart." },
        { english: "May the beneficent spirit help us to speak truth and act righteously. (Yasna 47.6)" },
        { english: "Hope is the thing with feathers that perches in the soul and sings without words." },
        { english: "Self-knowledge is the beginning of wisdom, self-acceptance the foundation of growth." },
        { english: "Grant me, O Truth, the rewards of good thinking that bring joy and satisfaction. (Yasna 50.4)" },
        { english: "The sacred fire burns brightest in the heart that chooses truth over comfort. Let your conscience be the altar where right intention dwells." },
        { english: "Truth without compassion is cruelty; compassion without truth is sentimentality—balance both." },
        { english: "I praise You as the greatest and best, as the most beautiful, O Mazda Ahura. (Yasna 43.16)" },
        { english: "Truth is the architect of happiness, the foundation of peace, the cornerstone of wisdom. Build your life upon this rock." },
        { english: "The weight of moral choice is the proof of human dignity—angels don't choose, demons can't choose, but you can." },
        { english: "Plant seeds of hope in winter and trust them to bloom when spring returns to your life." },
        { english: "Appreciation is the highest form of prayer—seeing the divine in every blessing." },
        { english: "The future is not predetermined but is being written by every choice you make right now." },
        { english: "When shadows of doubt gather, kindle the inner flame of discernment. Fire purifies not by destroying, but by revealing what is true." },
        { english: "Begin each day as if it were your first—with wonder. End each day as if it were your last—with gratitude." },
        { english: "Morning brings the gift of choice renewed. Stand at the crossroads of thought and deed—which path serves the light?" },
        { english: "We invoke good thinking, truth, and the beneficent spirit of Ahura Mazda. (Yasna 37.4)" },
        { english: "Where truth flourishes, freedom follows; where freedom is genuine, truth is honored." },
        { english: "The divine dwells not only in temples but in every heart that welcomes it, every life that serves it." },
        { english: "The sacred fire asks no permission to burn, needs no fuel but truth, casts no shadow but illumination." },
        { english: "May we be instruments of peace, servants of truth, children of light. (Benediction)" },
        { english: "Let the fire within you remember the spark of dawn—every choice a new horizon to the world's unfolding. Walk in watchfulness, and the light of Good Mind will not fail you." },
        { english: "Devotion asks not what you can receive but what you can give, not what you deserve but what you can serve." },
        { english: "Freedom is not the absence of constraints but the presence of meaningful options." },
        { english: "Through the beneficent spirit, may we overcome all obstacles to righteousness. (Prayer)" },
        { english: "The light of understanding grows not by accumulating facts but by illuminating connections." },
        { english: "The peaceful heart creates peaceful surroundings; the harmonious soul attracts harmonious relationships." },
        { english: "I take refuge in good thinking, truth, and Your lordship, Mazda, from whom comes the most beneficent spirit. (Yasna 33.5)" },
        { english: "Rational thought and intuitive wisdom are not opposites but partners in the dance of understanding." },
        { english: "When you have the power to help and choose not to, you become complicit in the suffering you could have prevented." },
        { english: "Like a candle lights a thousand candles without diminishing, share your inner light freely with all." },
        { english: "You are both the author and the main character of your life story—write it well." },
        { english: "The good mind is not the mind that knows everything but the mind that remains open to learning." },
        { english: "The stranger is just a friend you haven't met yet, a teacher you haven't learned from yet, a gift you haven't unwrapped yet." },
        { english: "Those who seek to destroy my family and clan, Mazda, I put them in Your hands through good thinking and truth. (Yasna 48.8)" },
        { english: "I pray to You with outstretched hands, O Mazda, seeking Your help through the beneficent spirit. (Yasna 50.8)" },
        { english: "Every decision is a seed planted in the soil of time. What kind of forest are you growing?" },
        { english: "Devotion is gratitude in action, love expressing itself through loyal service." },
        { english: "The fire of truth burns away all that is false in you, leaving only what is real and precious." },
        { english: "The unexamined life scatters like leaves in the wind; the examined life grows deep roots in truth." },
        { english: "The arc of justice bends only when people like you choose to bend it—be a force for righteousness." },
        { english: "Choose as if your choice matters to everyone who will ever live—because it does." },
        { english: "When Good Mind came to me, I first learned to proclaim Your words, O Mazda. (Yasna 43.15)" },
        { english: "To You, the beneficent ones shall come for refuge, Mazda, not to the followers of falsehood. (Yasna 48.4)" },
        { english: "Understanding comes not from standing above others but from standing with them in shared humanity." },
        { english: "The doorway to wisdom opens inward—the journey begins when you stop looking outside and start looking within." },
        { english: "May we be worthy of Your friendship through righteous actions, O Mazda. (Yasna 46.6)" },
        { english: "This I ask You: tell me truly, Ahura—what craftsman created light and darkness? (Yasna 44.5)" },
        { english: "Harmony does not require uniformity—an orchestra creates beauty through coordinated differences." },
        { english: "May Ahura Mazda be praised! May the beneficent spirit be glorified! (Traditional praise)" },
        { english: "Wisdom whispers while foolishness shouts—train your ear to hear the quiet voice of truth." },
        { english: "The measure of a society is how it treats those who cannot defend themselves." },
        { english: "What doesn't challenge you doesn't change you; what doesn't stretch you doesn't strengthen you." },
        { english: "Fair is not everyone getting the same thing; fair is everyone getting what they need to thrive." },
        { english: "Through Your fire, show me the rewards that come through truth for both parties—those who uphold righteousness and those who do not. (Yasna 31.3)" },
        { english: "The world is changed not by those who point out what's wrong but by those who do what's right." },
        { english: "Service is love made visible, compassion made practical, faith made fruitful." },
        { english: "I have recognized You as beneficent through truth and good thinking, O Mazda. (Yasna 49.5)" },
        { english: "The holy is not somewhere else or some time else but here and now, in this place, at this moment." },
        { english: "Let your presence be a sanctuary where others can find rest from the storms of life." },
        { english: "Friendship is truth telling and burden sharing, celebration and consolation, walking together toward the light." },
        { english: "Small daily improvements lead to stunning yearly results—be consistent rather than dramatic." },
        { english: "The mind that dwells in truth becomes a sanctuary where peace is always available." },
        { english: "Your life is a sacred text written one choice at a time—make it a beautiful story." },
        { english: "Blessed is he who brings happiness to others through truth and good deeds. (Traditional blessing)" },
        { english: "You are the protector of the righteous, O Mazda, through Your beneficent spirit. (Yasna 47.3)" },
        { english: "This I ask You: tell me truly, Ahura—who established the path of the sun and stars? (Yasna 44.5)" },
        { english: "At the crossroads of decision, remember: you are always choosing not just for yourself but for all who will follow." },
        { english: "I approach You, O Mazda, with good thinking, so that You may grant me both the blessings of this existence and that of the spirit. (Yasna 28.4)" },
        { english: "Your life is your offering—what will you place on the altar of existence?" },
        { english: "Learning from others shortens your path to wisdom; teaching others deepens your own understanding." },
        { english: "Pure thoughts birth noble words; noble words inspire righteous deeds; righteous deeds purify thoughts in return." },
        { english: "Every meal is communion when shared with gratitude, every conversation prayer when spoken with love." },
        { english: "The freedom to choose your response to any situation is the last of human freedoms—exercise it wisely." },
        { english: "Your conscience is your connection to cosmic justice—honor it by living in alignment with its guidance." },
        { english: "Every sunrise is nature's way of saying, 'Try again'—accept the invitation with gratitude." },
        { english: "Truth is patient but not passive, gentle but not weak, humble but not uncertain of its worth." },
        { english: "Action without reflection is blind; reflection without action is empty; but action guided by reflection is transformative." },
        { english: "Righteousness is the best good. Happiness to him who is righteous for the sake of righteousness alone. (Ashem Vohu variation)" },
        { english: "Community is not a place but a relationship, not a location but a connection." },
        { english: "Good thinking leads to good feeling, good feeling leads to good willing, good willing leads to good living." },
        { english: "Every crossroads is a classroom, every decision a teacher, every consequence a lesson." },
        { english: "The present moment is the only moment over which you have power—make it count." },
        { english: "Hope is not naive optimism but courageous commitment to work for what ought to be." },
        { english: "Every mistake is a teacher in disguise, every failure a step toward success, every setback a setup for comeback." },
        { english: "The inner fire burns brightest not when fed by passion but when fueled by principle." },
        { english: "Your privilege is not your fault, but your responsibility. Use whatever advantages you have to lift others." },
        { english: "Through Your radiant fire, assign the destiny of the righteous and the unrighteous, O Mazda, that our teaching may spread among the living. (Yasna 31.19)" },
        { english: "Knowledge builds walls to separate us from ignorance; wisdom builds bridges to connect us with all beings." },
        { english: "As long as I have strength and power, I shall teach people to seek truth. (Yasna 45.4)" },
        { english: "The beneficent spirit manifests wherever love meets action. Be the hands and heart through which goodness enters the world." },
        { english: "The bounteous mentality sees abundance everywhere—in every sunrise, every breath, every opportunity to serve the good." },
        { english: "The mind illuminated by truth sees possibilities where others see only problems. Think with hope, and hope becomes reality." },
        { english: "Peace begins with each person choosing to be peaceful, harmony starts with each individual choosing to be harmonious." },
        { english: "Let gratitude be your first thought at dawn, your last thought at dusk, your constant companion throughout the day." },
        { english: "I realized You, Mazda, to be beneficent when I was encircled by Good Mind, when he taught me to proclaim: 'Let not men seek to please the followers of falsehood.' (Yasna 43.11)" },
        { english: "Compassion is not feeling sorry for others but feeling with them, sharing their burden until it becomes lighter." },
        { english: "Count your blessings, not your problems; focus on your gains, not your losses; see your progress, not your perfection." },
        { english: "Compassion is not pity from above but solidarity from within—suffer with, celebrate with, grow with." },
        { english: "At every moment you are choosing who you are becoming—choose the highest version of yourself." },
        { english: "Evening reflection is the mirror of morning intention. End as mindfully as you began." },
        { english: "True knowledge transforms the knower. If you remain unchanged by what you learn, you have learned nothing." },
        { english: "The paradox of freedom: you are most free when you choose to serve something greater than yourself." },
        { english: "The ripple effects of your actions extend far beyond what you can see—act as if the future depends on you." },
        { english: "The fire of wisdom burns without consuming. Feed it with honest reflection, and it will illumine your path forever." },
        { english: "Let your thoughts be seeds of kindness, your words be rain of encouragement, your deeds be sunshine of hope." },
        { english: "For whom did You create this earth and sky? Who made the luminaries and the darkness? (Yasna 29.1)" },
        { english: "Your presence in the world matters more than you know—show up fully, authentically, lovingly." },
        { english: "When the world seems broken beyond repair, remember that you are part of the repair." },
        { english: "The darkness is never permanent, the light is never extinguished completely. Keep the vigil." },
        { english: "To help the world progress, O Mazda, we have sought You through good thinking. (Yasna 30.6)" },
        { english: "Let your spirit be a fountain, not a drain. Pour out blessing upon blessing, and watch the desert of despair bloom." },
        { english: "Loneliness is the human condition; connection is the human choice. Choose connection." },
        { english: "For a wise Lord I knew You to be, Mazda, when Good Mind came to me and asked: 'Who are you? To whom do you belong?' (Yasna 43.7)" },
        { english: "True strength is not in never falling but in how gracefully you rise each time you fall." },
        { english: "Disorder is not the opposite of truth but its absence—fill the void with authentic being." },
        { english: "The path of wisdom begins with a single step: the decision to begin walking." },
        { english: "True justice considers not only what is legal but what is right, not only what is permitted but what is beneficial." },
        { english: "Grant me, O Mazda, through Your most beneficent spirit, through truth, the rewards of good thinking, through which I may bring joy to my supporters. (Yasna 28.11)" },
        { english: "The fire of Ahura Mazda brings light to the righteous and terror to the wicked. (Fire prayer)" },
        { english: "Your choices are your prayers—they reveal what you truly worship, what you genuinely value." },
        { english: "The false teacher leads people astray from the path of good thinking and truth. (Yasna 32.3)" },
        { english: "The phoenix rises not in spite of the ashes but because of them—let your failures fuel your renewal." },
        { english: "Forgiveness is not condoning what was wrong but choosing to be free from the burden of carrying resentment." },
        { english: "I praise good thoughts, good words, good deeds, and the good religion. (Fravarane prayer)" },
        { english: "The greatest among you will be your servant—greatness is measured by how much you give, not how much you get." },
        { english: "The morning star reminds us: even in the darkest hour, light is already on its way." },
        { english: "Where differences divide, find common ground; where similarities unite, celebrate diversity." },
        { english: "You who are Mazda, through Your spirit and fire, through truth and good thinking, grant me integrity and strength. (Yasna 28.7)" },
        { english: "In the garden of the heart, plant seeds of truthful speech. Words watered with wisdom bloom into lasting peace." },
        { english: "Your daily habits are votes for the type of person you wish to become—vote wisely." },
        { english: "May we receive the promised reward, the joy that comes from truth, O Mazda. (Yasna 33.11)" },
        { english: "Hope plants seeds in winter, trusting in the promise of spring." },
        { english: "You are not just in the community; the community is in you—you carry it wherever you go." },
        { english: "Your presence is often more healing than your words, your listening more valuable than your advice." },
        { english: "You are a unique note in the symphony of existence—play your part beautifully and boldly." },
        { english: "Bridge-builders are more valuable than wall-builders, peacemakers more needed than warriors." },
        { english: "Growth requires leaving your comfort zone regularly—comfort and growth cannot coexist." },
        { english: "But the righteous man chooses truth and good thinking as his allies. (Yasna 32.2)" },
        { english: "The threefold path begins in the silence of right thinking, flows through the beauty of truthful speech, and culminates in the power of loving action." },
        { english: "Truth needs no defense, only expression. Speak it simply and let its power do the rest." },
        { english: "Through good deeds may we come to You, O Mazda, with joy and gladness. (Yasna 50.10)" },
        { english: "I beheld You clearly in my mind's eye as the first one at the birth of life, when You made actions have consequences—evil for the evil, good reward for the good. (Yasna 43.5)" },
        { english: "Inner peace is not a luxury but a necessity, not a retreat from the world but preparation for effective engagement." },
        { english: "The wise heart holds both confidence and humility, certainty and openness, in perfect balance." },
        { english: "Your breath connects you to every living being—breathe consciously, live connectedly." },
        { english: "Whoever upholds truth most, whether man or woman, O Mazda Ahura, is most dear to You. (Yasna 46.11)" },
        { english: "Yes, there are two fundamental spirits, twins, renowned to be in conflict. In thought and word, in action, they are two: the good and the bad. Between these two, the beneficent have correctly chosen. (Yasna 30.3)" },
        { english: "Transformation happens not when you try to become someone else but when you become more fully yourself." },
        { english: "Where injustice flourishes, it is not enough to be personally righteous. Stand up, speak out, act decisively." },
        { english: "Then spoke Ahura Mazda: We have no pastor here who is both knowing and holy. (Yasna 29.6)" },
        { english: "The practice of gratitude transforms ordinary moments into sacred experiences." },
        { english: "Truth is like the sun—you cannot look directly at it for long, but it lights everything else." },
        { english: "I shall serve You with good thinking, with truth and righteous action, so that You may grant me that which leads to the straight path. (Yasna 28.5)" },
        { english: "May good thinking and truth dwell in our house forever, O Ahura Mazda. (Yasna 60.6)" },
        { english: "Look within with the same honesty you demand from others, the same compassion you show to friends." },
        { english: "The healing the world needs begins with the healing you give yourself—be gentle, be patient, be kind." },
        { english: "Hope is not a feeling but a decision—decide to hope and then live as if your hope is justified." },
        { english: "One chooses that rule of good thinking allied with truth in order to serve the beneficent spirit. (Yasna 51.18)" },
        { english: "The good mind is a gift that grows with giving. Share your wisdom freely, and watch understanding multiply among all beings." },
        { english: "When thought, word, and deed align like three rivers meeting, their combined power can move mountains of indifference." },
        { english: "The music of the spheres plays on—attune your heart to hear the cosmic symphony of love." },
        { english: "We rise by lifting others, we succeed by serving others, we find ourselves by losing ourselves in love." },
        { english: "The truth you speak has a past—it comes from your experience. Make sure that past is worthy of the truth." },
        { english: "The beneficent spirit breathes in every act of kindness. When you lift another's burden, you lighten the world." },
        { english: "Your talents are gifts to be shared, not treasures to be hoarded—invest them in making the world better." },
        { english: "The grateful heart attracts more to be grateful for—appreciation is the magnet for abundance." },
        { english: "The person who knows their weaknesses is stronger than the person who denies them." },
        { english: "May good fortune come through truth to those who proclaim these teachings, O Mazda. (Yasna 51.16)" },
        { english: "Meditation is the art of listening to the still small voice that whispers your deepest truth." },
        { english: "The most important choice you make each day is who you choose to become in that day." },
        { english: "Order emerges not from control but from harmony—the willing cooperation of free beings choosing good." },
        { english: "True intelligence is not the ability to solve problems but to see the connections between all things." },
        { english: "Thus speaks the maiden: 'You are the support of good thinking, of truth, and of the lordship desired by Mazda.' (Yasna 53.3)" },
        { english: "The spiral of growth means you will revisit the same lessons at deeper levels—embrace the journey." },
        { english: "When you choose increase over decrease, healing over harm, you align with the progressive spirit of creation itself." },
        { english: "When someone trusts you with their vulnerability, you hold sacred ground. Tread carefully and gratefully." },
        { english: "Renewal comes not from changing everything at once but from changing one thing completely." },
        { english: "When will the noble warriors come who shall drive out from here the thirst of the wicked? (Yasna 32.1)" },
        { english: "The sacred space is wherever you are when you remember who you really are and why you are here." },
        { english: "Good thinking, good words, and good deeds—these three bring a person to paradise, the best existence, light, and all good things. (Traditional summary)" },
        { english: "The progressive spirit never asks 'Why me?' but always 'How can I help?' Be an answer to someone's prayer today." },
        { english: "Then shall I recognize You as mighty, Mazda, when through good thinking You shall grant the blessings that the truthful and untruthful seek. (Yasna 45.8)" },
        { english: "I know You to be the first and the last, O Ahura Mazda—You are father of good thinking, creator of truth, judge of our actions. (Yasna 31.8)" },
        { english: "Wisdom is not knowing all the answers but asking better questions. Begin with: How can I serve?" },
        { english: "Conscience is the ember of the divine fire planted in every human heart—tend it carefully." },
        { english: "By Your beneficent spirit and by fire, O Mazda, show me truth and good thinking, through whose work one goes to Your abode. (Yasna 31.20)" },
        { english: "Come to my help, O Mazda, grant me strength through truth and good thinking. (Yasna 33.6)" },
        { english: "Through good deeds and righteous words, may we please Your spirit, O Mazda. (Yasna 49.10)" },
        { english: "Through truth we serve the Lord of Wisdom with good mind and beneficial action. (Summary verse)" },
        { english: "Service is not about being needed but about being useful, not about being thanked but about being trustworthy." },
        { english: "I who shall serve You with good thinking... may I thus bring solace to the soul of Earth. (Yasna 28.2)" },
        { english: "Holiness is not about being perfect but about being present, not about being pure but about being real." },
        { english: "May we be guides for those who seek the path of truth and righteousness. (Yasna 31.22)" },
        { english: "Wisdom is like water—it takes the shape of whatever vessel contains it, yet never loses its essence." },
        { english: "The enlightened mind is like clear water—it reflects perfectly what is, without adding or subtracting anything." },
        { english: "A thankful heart is a magnet for miracles, drawing goodness from the infinite storehouse of grace." },
        { english: "The pattern that connects all things is love expressing itself as truth, truth expressing itself as justice." },
        { english: "We are all connected—what helps one helps all, what harms one harms all." },
        { english: "Both bridegroom and bride, bring your minds into agreement for the practice of the best thoughts. (Yasna 53.4)" },
        { english: "The questions you ask shape the life you live—ask better questions, live a better life." },
        { english: "May the light of good thinking shine in our hearts forever. (Prayer verse)" },
        { english: "True self-knowledge includes knowing not just what you are but what you could become." },
        { english: "I know You to be mighty when You help me with good thinking, O Mazda Ahura. (Yasna 31.5)" },
        { english: "Justice is not revenge but restoration—making right what has been wrong, healing what has been harmed." },
        { english: "The sun rises not because you need it but because it is the nature of the sun to shine—be like the sun." },
        { english: "Justice is love applied to systems, compassion embodied in institutions, kindness made structural." },
        { english: "Grant victory to those who speak truth and live righteously, O Ahura Mazda. (Yasna 48.12)" },
        { english: "The journey inward is the most courageous journey—it requires facing yourself without flinching." },
        { english: "I have realized You as beneficent, Mazda Ahura, when You came to me with good thinking and asked: 'Who are you willing to please?' (Yasna 49.3)" },
        { english: "Each choice carves a channel for future choices to follow. Choose wisely what river you dig for tomorrow." },
        { english: "Therefore may we be among those who make this world fresh and new! (Yasna 30.9)" },
        { english: "Truth is the gravity of the moral universe—what goes up in lies must come down in consequences." },
        { english: "The weight of choice is the price of consciousness. Bear it gladly, for it makes you a partner in creation's unfolding." },
        { english: "This I ask You: Which is the first and which the last? (Yasna 44.6)" },
        { english: "Thank the sunrise for its faithfulness, the earth for its generosity, life for its infinite possibilities." },
        { english: "The sacred is not separate from the ordinary but hidden within it, waiting to be discovered." },
        { english: "Reflect with a clear mind—each person for themselves—before the Great Event of Choices. Awaken to this doctrine: there is no compromise between right and wrong. (Yasna 30.2)" },
        { english: "Your choices reveal your values more accurately than your words—choose as if your character depends on it." },
        { english: "You are not just in the world; the world is in you—take care of both." },
        { english: "Time is the canvas, your choices the paint, your life the masterpiece—create something beautiful." },
        { english: "I entrust my soul to You, O Mazda, seeking Your protection through good thinking. (Yasna 48.9)" },
        { english: "The isolated tree falls in the storm; the forest of trees stands strong together." },
        { english: "Sacred living means recognizing the extraordinary within the ordinary, the eternal within the temporal." },
        { english: "The arc of the moral universe bends toward justice only when conscious beings like you and me choose to bend it." },
        { english: "The cosmic order is written in every sunrise, every heartbeat, every act of genuine kindness." },
        { english: "This I ask You: Who holds up the earth below and keeps the sky from falling? (Yasna 44.4)" },
        { english: "Let the fire within purify your motives, clarify your vision, energize your compassion." },
        { english: "The strength of the individual is the community; the strength of the community is the individual." },
        { english: "The hands that heal are holier than the hands that pray without helping." },
        { english: "The grateful heart sees abundance everywhere; the ungrateful heart finds scarcity in plenty." },
        { english: "This I ask You: tell me truly, Ahura—how shall I drive deceit far from us who seek to promote truth in the world? (Yasna 51.4)" },
        { english: "Every ending contains a beginning; every death, a birth; every loss, an opportunity for growth." },
        { english: "Know yourself not to become self-absorbed but to become self-aware, not to focus inward but to focus clearly." },
        { english: "When these two spirits came together in the beginning, they established life and not-life, and how at the end the worst existence shall be for the followers of falsehood, but the best mind for the truthful. (Yasna 30.4)" },
        { english: "Wisdom is the art of living skillfully, the science of choosing well, the practice of loving wisely." },
        { english: "In the morning, set your mind like a compass toward truth; let all your steps follow this direction." },
        { english: "May Your fire shine forth to help the supporter of truth, O Mazda. (Yasna 34.4)" },
        { english: "The curious mind stays young, the learning heart stays open, the growing soul stays alive." },
        { english: "The bridge between what is and what could be is built with the materials of hope and hard work." },
        { english: "The mirror of self-reflection shows not what you want to see but what you need to see." },
        { english: "Let truth be our guide, good thinking our companion, right action our path. (Summary)" },
        { english: "The universe conspires to help those who help themselves and others—be part of the conspiracy of good." },
        { english: "Every act of love is a victory over the forces that diminish life—love boldly, love widely, love deeply." },
        { english: "The paradox of wisdom: the more you truly know, the more you realize how much you don't know." },
        { english: "Each day offers lessons if you are willing to be a student, opportunities if you are willing to try." },
        { english: "Justice is not just a destination but a journey—walk it one step at a time, one choice at a time." },
        { english: "The beginner's mind sees possibilities everywhere; the expert mind sees problems in everything." },
        { english: "Every choice is a prayer, every decision a vote for the kind of world you want to live in." },
        { english: "Justice delayed is often justice denied, but justice rushed is sometimes injustice accomplished. Seek the balanced way." },
        { english: "To what land to flee? Where shall I go to flee? They exclude me from family and clan. (Yasna 46.1)" },
        { english: "You are the one who rewards both the truthful and the untruthful according to their deeds. (Yasna 43.12)" },
        { english: "Who, Mazda, is the faithful friend of Your spirit? Let him teach me the straight paths of good thinking and of truth. (Yasna 47.4)" },
        { english: "With outstretched hands I pray to You, O Mazda, first of all through truth. (Yasna 28.1)" },
        { english: "Self-reflection without self-compassion becomes self-criticism; self-compassion without self-reflection becomes self-deception." },
        { english: "May good thinking reign supreme, may truth be established in the world. (Yasna 45.10)" },
        { english: "True belonging doesn't require you to change who you are; it requires you to be who you are." },
        { english: "When you light the lamp of compassion, you illuminate your own path as well as others'." },
        { english: "The order of existence rewards those who align with it, not to punish those who don't, but to heal what is broken." },
        { english: "The good mind seeks first to understand, then to be understood; first to serve, then to be served." },
        { english: "The trinity of human goodness—think well, speak well, act well—echoes the divine harmony that sustains all worlds." },
        { english: "Freedom is not the absence of consequences but the power to choose which consequences you will embrace." },
        { english: "Every moment is a fresh beginning, every breath a new chance, every choice a sacred opportunity." },
        { english: "Begin each day by asking: How can I make today better than yesterday? End each day by answering: How did I succeed?" },
        { english: "Through Your most beneficent spirit, O Mazda, I seek to do Your will. (Yasna 47.1)" },
        { english: "The greatest sermon is a life well-lived in service to truth, beauty, and goodness." },
        { english: "The deepest truth is often the most simple: be kind, be honest, be helpful, be present." },
        { english: "Peace is not the absence of conflict but the presence of justice, not the silence of oppression but the harmony of mutual respect." },
        { english: "The darkest night produces the brightest stars—your current darkness may be developing your greatest light." },
        { english: "Connection is the energy that exists between people when they feel seen, heard, and valued." },
        { english: "Like fire transforms wood to light, let your choices transform the world from what it is to what it should be." },
        { english: "Through good thinking, truth, and the spirit's power, they shall overcome the violence of the deceitful. (Yasna 32.16)" },
        { english: "The day unfolds like a scroll waiting to be written. What story will your choices tell?" },
        { english: "The gift of choice is also the burden of choice—embrace both aspects with equal courage." },
        { english: "The scales of justice are balanced not by equal punishment but by proportional restoration." },
        { english: "The seeds of tomorrow are planted in the soil of today—plant wisely." },
        { english: "Good thinking is the bridge between knowing and acting. Cross it with courage, and find yourself in the land of fulfillment." },
        { english: "I approach You, Mazda, with hands outstretched, with good thinking, with truth, hoping to please Your spirit with righteous actions. (Yasna 50.5)" },
        { english: "The heart that has been broken and healed is stronger than one that has never been tested." },
        { english: "Thanksgiving is not just a day but a way of life—live thankfully and you will have much to be thankful for." },
        { english: "Begin each day by asking: How shall I increase the good in the world through my being here?" },
        { english: "The wise person learns from everyone, teaches everyone, and judges no one harshly." },
        { english: "Each breath is a gift, each heartbeat a blessing, each moment an opportunity for thankfulness." },
        { english: "Like a lighthouse guides ships safely home, let your conscience guide you through moral storms to peaceful harbors." },
        { english: "Your legacy is not what you leave behind but what you build in others while you are here." },
        { english: "The growing edge is always uncomfortable—that's how you know you're growing." },
        { english: "We seek Your blessing through fire, through truth, through good thinking. (Yasna 36.3)" },
        { english: "This I ask You: tell me truly, Ahura—who was the first father of truth by begetting? (Yasna 44.3)" },
        { english: "Morning is creation's invitation to begin again. Accept it with gratitude and intentional presence." },
        { english: "Your conscience is the hearth of heaven—tend it with thoughts of justice, words of compassion, deeds of righteousness." },
        { english: "Your life may be a drop in the ocean, but without your drop the ocean would be less." },
        { english: "When moral darkness surrounds you, be the flame that others can navigate by." },
        { english: "Grant us, O Mazda, the straight paths of good thinking and truth. (Yasna 33.5)" },
        { english: "Your conscience is the sacred fire that never sleeps, never lies, never abandons you in darkness." },
        { english: "Your work in the world is your worship—do it with the reverence you would bring to the most sacred task." },
        { english: "True leadership is not about being served but about serving, not about having followers but about creating leaders." },
        { english: "Renewal comes not from changing your circumstances but from changing your relationship to your circumstances." },
        { english: "Speak to me as friend speaks to friend! Show me the supports on which both worlds rest. (Yasna 31.3)" },
        { english: "The light you seek is the light you are—stop looking for it and start being it." },
        { english: "Honesty is telling the truth to other people; integrity is telling the truth to yourself." },
        { english: "The wise person is not one who has never erred but one who learns from every mistake." },
        { english: "When the mind is clear like mountain water, right decisions flow naturally. Still the turbulent thoughts and find your center." },
        { english: "Through the beneficent spirit, Mazda, give me strength for good thinking, that I may find the straight paths of life. (Yasna 47.2)" },
        { english: "May we be among those who make this world progress, who are the healers of this world, O Mazda and You, O Truth. (Yasna 30.9)" },
        { english: "The wise Lord rewards those who serve truth with sincerity and devotion. (Teaching verse)" },
        { english: "The divine spark within you knows the difference between right and wrong—trust it, follow it, serve it." },
        { english: "The inner flame burns brightest when fed by deeds of righteousness, words of truth, thoughts of love." },
        { english: "The deepest wisdom is often the simplest truth, lived with complete sincerity." },
        { english: "Every person you meet is fighting a battle you know nothing about—be kind, be patient, be present." },
        { english: "The man of good life speaks to him of ill life: 'May your conscience torment you continuously!' (Yasna 46.11)" },
        { english: "The flame that burns for justice never consumes the just, only the injustice they oppose." },
        { english: "We approach You, O Ahura Mazda, with good thinking and truth, seeking Your blessing. (Yasna 34.1)" },
        { english: "Personal evolution is not about perfection but about progression, not about arrival but about journey." },
        { english: "Gratitude is the memory of the heart—it never forgets a kindness received or given." },
        { english: "I shall worship You with good thinking, O Mazda Ahura, so that You may teach me truth through Your spirit. (Yasna 45.6)" },
        { english: "Each dawn brings the covenant renewed: to think with clarity, speak with truth, act with love." },
        { english: "Kindness is the universal language that the deaf can hear and the blind can see." },
        { english: "Even in the darkest times, remember: you are here for a reason, at this time, in this place." },
        { english: "The phoenix is not reborn from ashes but through them—transformation requires embracing the fire." },
        { english: "As the first, O Mazda, You gave bodies and breath to the corporeal world through Your thought. (Yasna 31.11)" },
        { english: "Your inner fire is not yours alone—it is borrowed from the eternal flame that lights all worlds." },
        { english: "The river that moves you also moves through you—you are not separate from the flow of life." },
        { english: "The ultimate measure of your life is not what you accomplish but who you become." },
        { english: "The most precious gift you can give another person is your full, undivided, loving attention." },
        { english: "Truth is not a destination but a way of walking. Each step in harmony with what is right brings the world closer to wholeness." },
        { english: "May Ahura Mazda grant us that good which we seek through truth and good thinking. (Yasna 60.12)" },
        { english: "Gratitude turns what we have into enough, transforms ordinary days into thanksgivings, routine jobs into joy." },
        { english: "Love is the recognition that the other person's happiness is as important as your own—maybe more important." },
        { english: "Every person you meet is your teacher—some teach by example, others by cautionary tale." },
        { english: "Through righteousness may we attain that world of good thinking. (Yasna 34.15)" },
        { english: "The deceitful one chose to bring to realization the worst things. But the very beneficent spirit chose truth, and so shall those who satisfy the Wise Lord continuously with true actions. (Yasna 30.5)" },
        { english: "Each breath is a chance to choose life over death, hope over despair, love over fear." },
        { english: "True understanding comes not from accumulating facts but from seeing the patterns that connect all things." },
        { english: "Every act of service is a prayer, every moment of helpfulness a hymn, every gesture of kindness a blessing." },
        { english: "Where truth blooms, falsehood cannot take root. Cultivate the garden of your life with seeds of honesty and integrity." },
        { english: "The future is not fixed because you are still choosing—make your next choice count." },
        { english: "The most powerful force in the universe is a human being living in alignment with their highest truth." },
        { english: "When you see injustice and do nothing, you become part of the injustice—speak up, stand up, act up." },
        { english: "As rivers seek the sea, let your thoughts flow toward truth. In the silence of right action, wisdom speaks without words." },
        { english: "Your daily work is your temple, your loving relationships your prayer, your kind actions your worship." },
        { english: "The true order of existence is good; the most-good existence it is; desire it! Wish it! Happiness, bliss, enlightenment it is for that existence which is the true order of existence. (Ashem Vohu)" },
        { english: "The heart that has known pain is the heart most capable of healing others' pain." },
        { english: "Conflict is often the birth-pain of greater understanding—do not avoid it, but engage it constructively." },
        { english: "Clear thinking leads to clear speaking, which leads to clear acting. Begin each day by clarifying your deepest intentions." },
        { english: "The order of existence reveals itself to those who seek with sincere hearts. Look closely—truth hides in plain sight." },
        { english: "Let the actions of good thinking come to fruition for the man who teaches truth to Zarathustra. (Yasna 28.6)" },
        { english: "The loving man who brings help to the truthful, whether kinsman or fellow-member of the community, is in good accord with truth. (Yasna 46.2)" },
        { english: "When shall I know that You have power over those who cause harm to me, O Mazda? Let fire accompanied by good thinking make this known to me through truth. (Yasna 48.7)" },
        { english: "Clarity comes not from having all the answers but from asking the right questions." },
        { english: "Wisdom is knowing what to do; virtue is doing it; integrity is being consistent in both." },
        { english: "And when punishment comes to the wicked, then shall Your power be revealed to all, O Mazda. (Yasna 30.8)" },
        { english: "Your network is not about who can help you but who you can help, not who you know but who knows they can count on you." },
        { english: "Every ending is a new beginning in disguise—look for the hidden gift in every goodbye." },
        { english: "Through truth I complete my worship and my praise with actions, O Mazda Ahura. (Yasna 50.11)" },
        { english: "Where shall the righteous man find refuge when the wicked overwhelm the land? (Yasna 46.1)" },
        { english: "Like a river finds its course, truth finds its way through every obstacle. Be the clear channel through which it flows." },
        { english: "Every moment offers the great choice: will you add to the world's burden or its blessing? Choose consciously." },
        { english: "The rhythm of sunrise and sunset teaches the sacred pace of effort and rest, engagement and reflection." },
        { english: "Your fire, strong through truth, is a visible help to Your supporter, but visible harm to Your enemy, O Ahura Mazda. (Yasna 34.4)" },
        { english: "The soul of the earth cries out: For whom did You fashion me? Who created me? (Yasna 29.1)" },
        { english: "Service is the rent we pay for living on this planet—pay it gladly and generously." }
    ];

    // Create a long, seamless loop for the reel
    const numRepeats = 5; // Number of times to repeat the fortunes array
    const prePendCount = fortunes.length; // Number of items to prepend for smooth loop

    const baseReelItems = [];
    for (let i = 0; i < numRepeats; i++) {
        baseReelItems.push(...fortunes);
    }

    const reelItems = [
        ...baseReelItems.slice(baseReelItems.length - prePendCount),
        ...baseReelItems,
        ...baseReelItems.slice(0, prePendCount) // Append for smooth loop
    ];

    const handleSpin = async () => {
        

        if (isSpinning || !englishReelRef.current || spinsLeft <= 0) {
            console.log('No spins left or already spinning.');
            return;
        }

        console.log('handleSpin called'); // Debugging line
        try {
            const sound = new Audio('/gear-click-351962.mp3');
            sound.play().catch(e => console.error("Error playing sound:", e));
        } catch (e) {
            console.error("Error creating Audio object:", e);
        }
        setIsSpinning(true);
        setSpinsLeft(prev => prev - 1); // Decrement spins left

        // Update spin count in Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const today = new Date().toISOString().slice(0, 10);
            const { error } = await supabase
                .from('daily_spins')
                .upsert({ user_id: user.id, spin_date: today, spin_count: 3 - spinsLeft + 1 }, { onConflict: 'user_id, spin_date' });
            if (error) {
                console.error('Error updating daily spin count:', error);
            }
        }

        const finalIndexInFortunes = Math.floor(Math.random() * fortunes.length);
        // Calculate target index within the *middle* section of baseReelItems
        const targetIndexInReelItems = prePendCount + finalIndexInFortunes + (fortunes.length * Math.floor(numRepeats / 2));
        
        // English reel scrolls up (negative transform)
        const englishTargetY = targetIndexInReelItems * itemHeight;
        englishReelRef.current.classList.add(styles.prophecyReelSpinning);
        englishReelRef.current.style.transform = `translateY(-${englishTargetY}px)`;

        

        setTimeout(() => {
            if (!englishReelRef.current) return;
            englishReelRef.current.classList.remove(styles.prophecyReelSpinning);
            
            // Reset English reel to the equivalent position in the *first* repetition
            englishReelRef.current.style.transition = 'none';
            const englishResetY = finalIndexInFortunes * itemHeight;
            englishReelRef.current.style.transform = `translateY(-${englishResetY}px)`;
            
            
            
            void englishReelRef.current.offsetHeight; // Force reflow

            englishReelRef.current.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
            setIsSpinning(false);
        }, 1600); // Slightly longer than 1.5s transition in CSS for smoother reset
    };

    return (
        <>
            {/* English Reel (Top Left) */}
            <div className={`${styles.prophecyMask} ${styles.englishMask}`} onClick={handleSpin}>
                <div ref={englishReelRef} className={styles.prophecyReel}>
                    {reelItems.map((item, index) => (
                        <div key={index} className={styles.prophecyItem}>
                            <span className={styles.englishText}>{item.english}</span>
                        </div>
                    ))}
                </div>
            </div>

            
        </>
    );
}

// --- UI COMPONENTS ---
const HeroSection: React.FC<{ contentMap: Map<string, HomepageContentItem>, spinsLeft: number, setSpinsLeft: React.Dispatch<React.SetStateAction<number>> }> = ({ contentMap, spinsLeft, setSpinsLeft }) => {
    const title = contentMap.get('hero_title')?.content || 'Zoroasterverse';
    const quote = contentMap.get('hero_quote')?.content || '“Happiness comes to them who bring happiness to others.”';
    const intro = contentMap.get('hero_description')?.content || 'Learn about the teachings of the prophet Zarathustra, the history of one of the world’s oldest religions, and the principles of Good Thoughts, Good Words, and Good Deeds.';

    return (
        <section id="home" className={styles.zrHero}>
            <div className={styles.zrHeroContent}>
                <h1 className={styles.zrTitle}>{title}</h1>
                <p className={styles.zrQuote}>{quote}</p>
                <p className={styles.zrIntro}>{intro}</p>
                <Link className={styles.zrCta} to="/blog/about">
                    Learn More
                </Link>
            </div>
            <figure className={styles.zrHeroArt} aria-labelledby="art-caption">
                <video 
                    src="/200716-913538378.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className={styles.videoFire}
                />
                <div className={styles.spinsIndicator}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`${styles.spinDot} ${i < spinsLeft ? styles.spinDotActive : ''}`}></div>
                    ))}
                </div>
                <DualScrollingProphecy spinsLeft={spinsLeft} setSpinsLeft={setSpinsLeft} />
                <figcaption id="art-caption" className={styles.srOnly}>
                    A stylized winged figure above a sacred fire.
                </figcaption>
            </figure>
        </section>
    );
};

const LatestPosts: React.FC<{ posts: Post[] }> = ({ posts }) => {
    return (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Latest News & Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => {
                    const excerpt = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
                    return (
                        <div key={post.id} className={styles.parchmentCard}>
                            <h3>{post.title}</h3>
                            <p className="mt-2" dangerouslySetInnerHTML={{ __html: excerpt }}></p>
                            <Link to={`/blog/${post.slug}`} className="mt-4 inline-block">Read More</Link>
                        </div>
                    )
                })}
            </div>
        </section>
    );
};

const LatestReleases: React.FC<{ releases: ReleaseItem[] }> = ({ releases }) => {
    return (
        <section className={styles.zrSection}>
            <h2 className={styles.zrH2}>Latest Releases</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {releases.map(release => (
                    <div key={release.id} className={styles.parchmentCard}>
                        <h3>{release.title}</h3>
                        <p className="mt-2">Type: {release.type}</p>
                        <a href={release.link || '#'} className="mt-4 inline-block">View Details / Purchase</a>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- MAIN HOME PAGE COMPONENT ---
export const HomePage = () => {
  const { data: homepageData, isLoading: isLoadingHomepage, isError: isErrorHomepage } = useQuery<HomepageContentItem[]>({ queryKey: ['homepageContent'], queryFn: fetchHomepageContent });
  const { data: latestPosts, isLoading: isLoadingPosts, isError: isErrorPosts } = useQuery<Post[]>({ queryKey: ['latestPosts'], queryFn: fetchLatestPosts });
  const { data: releaseData, isLoading: isLoadingReleases, isError: isErrorReleases } = useQuery<ReleaseItem[]>({ queryKey: ['releaseItems'], queryFn: fetchReleaseItems });

  const [spinsLeft, setSpinsLeft] = useState(3); // Default to 3 spins
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null);

  useEffect(() => {
      const fetchSpins = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
              setSpinsLeft(0); // No spins for unauthenticated users
              return;
          }

          const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

          const { data, error } = await supabase
              .from('daily_spins')
              .select('*')
              .eq('user_id', user.id)
              .eq('spin_date', today)
              .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
              console.error('Error fetching daily spins:', error);
              setSpinsLeft(0);
              return;
          }

          if (data) {
              setSpinsLeft(3 - data.spin_count);
              setLastSpinDate(data.spin_date);
          } else {
              // No entry for today, user has full spins
              setSpinsLeft(3);
              setLastSpinDate(today);
              // Create a new entry for today
              const { error: insertError } = await supabase
                  .from('daily_spins')
                  .insert({ user_id: user.id, spin_date: today, spin_count: 0 });
              if (insertError) {
                  console.error('Error inserting new daily spin entry:', insertError);
              }
          }
      };

      fetchSpins();
  }, []); // Run once on component mount

  const isLoading = isLoadingHomepage || isLoadingPosts || isLoadingReleases;
  const isError = isErrorHomepage || isErrorPosts || isErrorReleases;

  if (isLoading) return <div className="text-center py-8">Loading homepage content...</div>;
  if (isError) return <div className="text-center py-8 text-red-400">Error loading homepage content.</div>;

  const contentMap = new Map(homepageData?.map(item => [item.section, item]));

  return (
    <div>
      <HeroSection contentMap={contentMap} spinsLeft={spinsLeft} setSpinsLeft={setSpinsLeft} />

      {/* Statistics Section */}
      <section className={styles.zrSection}>
          <h2 className={styles.zrH2}>Our Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_words_written')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Words Written</p>
              </div>
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_beta_readers')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Beta Readers</p>
              </div>
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_average_rating')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Average Rating</p>
              </div>
              <div className={styles.parchmentCard}>
                  <h3 className="text-4xl font-bold text-primary">
                      {contentMap.get('statistics_books_published')?.content || '0'}
                  </h3>
                  <p className="text-muted-foreground">Books Published</p>
              </div>
          </div>
      </section>
      <LatestPosts posts={latestPosts || []} />
      <LatestReleases releases={releaseData || []} />

      <section className={styles.zrSection}>
          <h2 className={styles.zrH2}>Artist Collaboration</h2>
          <div className="relative rounded-lg shadow-lg overflow-hidden w-full">
              <img src="/images/invite_to_Colab_card.png" alt="Artist Collaboration Invitation" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 text-shadow-md">Join Our Creative Team!</h3>
                  <p className="text-white mb-6 text-shadow-sm">We're looking for talented artists to help shape the visual identity of the Zangar/Spandam Series. Explore revenue-share opportunities and bring your vision to life.</p>
                  <Link to="/artist-collaboration" className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                      Apply Now
                  </Link>
              </div>
          </div>
      </section>
    </div>
  );
};
