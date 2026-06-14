import { motion } from 'framer-motion';
import { FoodImage } from '../components/ui/FoodImage';
import { Button } from '../components/ui/Button';
import { SITE } from '../lib/site';

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const STORY = [
  {
    eyebrow: 'Chapter 01',
    title: 'How It Started',
    body: [
      'It began as a pop-up on a Brooklyn sidewalk in 2019 — one griddle, one cooler, and a hand-painted sign. The smell pulled people off the train. The line wrapped the block by week three.',
      'We never planned to open a restaurant. The neighborhood basically demanded it.',
    ],
    img: u('1556910103-1c02745aae4d'),
    flip: false,
  },
  {
    eyebrow: 'Chapter 02',
    title: 'The Meat',
    body: [
      'We grind a custom blend of brisket, short rib and chuck every single morning. Never frozen, never pre-formed. Hand-pressed onto a screaming-hot flat top so the edges go lacy and crisp.',
      'Sourced from a family ranch upstate. We know the people. We know the cows. That matters.',
    ],
    img: u('1551782450-a2132b4ba21d'),
    flip: true,
  },
  {
    eyebrow: 'Chapter 03',
    title: 'The Sauce',
    body: [
      'There is one sauce. We will never tell you what is in it. People have offered us money. People have tried to reverse-engineer it in home labs. They were close. They were not right.',
      'It goes on everything. Resistance is futile.',
    ],
    img: u('1607013251379-e6eecfffe234'),
    flip: false,
  },
];

const CREW = [
  { name: 'Theo Marsh', role: 'Founder / Head Cook', img: u('1583394838336-acd977736f90', 500) },
  { name: 'Lena Ortiz', role: 'Kitchen Director', img: u('1577219491135-ce391730fb2c', 500) },
  { name: 'Dré Coleman', role: 'Pit & Sauce Master', img: u('1622253692010-333f2da6031d', 500) },
];

const VALUES = ['Quality Or Nothing.', 'Sourced Local. Always.', 'Made To Order. Every Time.'];

function StoryBlock({ item, index }: { item: (typeof STORY)[number]; index: number }) {
  return (
    <div
      className={`grid lg:grid-cols-2 gap-10 items-center ${item.flip ? 'lg:[direction:rtl]' : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, x: item.flip ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="[direction:ltr]"
      >
        <p className="label text-red mb-3">{item.eyebrow}</p>
        <h2 className="display text-white text-5xl md:text-7xl mb-5">{item.title}</h2>
        <div className="space-y-4 text-white/65 font-body text-lg leading-relaxed max-w-xl">
          {item.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="[direction:ltr]"
      >
        <FoodImage
          src={item.img}
          alt={item.title}
          fallbackLabel={item.title}
          className={`w-full aspect-[4/3] border-2 ${index % 2 ? 'border-yellow' : 'border-red'} shadow-neon-sm`}
        />
      </motion.div>
    </div>
  );
}

export default function About() {
  return (
    <>
      {/* hero */}
      <section className="relative h-[70vh] min-h-[440px] flex items-end overflow-hidden">
        <FoodImage
          src={u('1514516345957-556ca7d90a29', 1600)}
          alt="The GRINDHOUSE kitchen"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 w-full">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="label text-yellow mb-3"
          >
            {SITE.est}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display text-white text-6xl sm:text-8xl md:text-9xl"
          >
            The Grind <span className="text-red glow-red">Behind It.</span>
          </motion.h1>
        </div>
      </section>

      {/* story */}
      <section className="bg-black py-20 md:py-28 grain relative">
        <div className="relative z-10 mx-auto max-w-7xl px-5 space-y-24">
          {STORY.map((item, i) => (
            <StoryBlock key={item.title} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* crew */}
      <section className="bg-grey py-20 md:py-28 grain relative border-y-2 border-grey-mid">
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <p className="label text-red mb-3">Chapter 04</p>
          <h2 className="display text-white text-5xl md:text-7xl mb-12">The Crew</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {CREW.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group border-2 border-grey-mid hover:border-red transition-colors"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <FoodImage
                    src={member.img}
                    alt={member.name}
                    fallbackLabel={member.name}
                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-4 bg-black">
                  <h3 className="font-display text-3xl text-white leading-none">{member.name}</h3>
                  <p className="label text-red mt-2">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* values */}
      <section className="bg-red py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 space-y-2">
          {VALUES.map((v, i) => (
            <motion.h3
              key={v}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="display text-black text-5xl sm:text-7xl md:text-8xl hover:text-white transition-colors"
            >
              {v}
            </motion.h3>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="bg-black py-20 text-center grain relative">
        <div className="relative z-10">
          <h2 className="display text-white text-5xl md:text-7xl mb-6">Hungry Yet?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button to="/menu" variant="red">
              See The Menu
            </Button>
            <Button to="/reservations" variant="outline">
              Book A Table
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
