import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { SITE, MAPS_EMBED, MAPS_DIRECTIONS } from '../../lib/site';

export function LocationSection() {
  return (
    <section className="relative bg-black py-20 md:py-28 overflow-hidden grain border-t-2 border-grey-mid">
      <div className="relative z-10 mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-10 items-stretch">
        {/* map */}
        <div className="relative min-h-[340px] border-4 border-red shadow-neon-sm">
          <iframe
            title="GRINDHOUSE location map"
            src={MAPS_EMBED}
            className="absolute inset-0 w-full h-full grayscale contrast-125"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* info */}
        <div className="flex flex-col justify-center">
          <p className="label text-red mb-3">Come hungry</p>
          <h2 className="display text-white text-5xl md:text-7xl mb-8">Find Us</h2>

          <div className="space-y-7">
            <div className="flex gap-4">
              <MapPin className="text-red shrink-0 mt-1" size={24} />
              <div>
                <p className="label text-white/40 mb-1">Address</p>
                <p className="font-body text-white text-lg">
                  {SITE.address.line1}, {SITE.address.line2}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="text-red shrink-0 mt-1" size={24} />
              <div className="w-full max-w-sm">
                <p className="label text-white/40 mb-2">Hours</p>
                <table className="w-full font-mono text-sm">
                  <tbody>
                    {SITE.hours.map((h) => (
                      <tr key={h.days} className="border-b border-grey-mid/60">
                        <td className="py-2 text-white/80 uppercase">{h.days}</td>
                        <td className="py-2 text-yellow text-right">{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-red shrink-0 mt-1" size={24} />
              <div>
                <p className="label text-white/40 mb-1">Phone</p>
                <a href={SITE.phoneHref} className="font-body text-white text-lg hover:text-red">
                  {SITE.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button href={MAPS_DIRECTIONS} variant="red">
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
