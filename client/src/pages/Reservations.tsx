import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, MapPin, PartyPopper, RotateCcw } from 'lucide-react';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { useToast } from '../components/ui/Toast';
import { createReservation, type ReservationResult } from '../api/reservation.api';
import { getErrorMessage } from '../api/client';
import { SITE } from '../lib/site';

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
];

const schema = z.object({
  name: z.string().min(2, 'Tell us your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  date: z.string().min(1, 'Pick a date'),
  time: z.string().min(1, 'Pick a time'),
  guests: z.coerce.number().int().min(1).max(20),
  notes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

const today = new Date().toISOString().split('T')[0];

export default function Reservations() {
  const { toast } = useToast();
  const [result, setResult] = useState<ReservationResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 2 },
  });

  const mutation = useMutation({
    mutationFn: createReservation,
    onSuccess: (data) => {
      setResult(data);
      toast('Table booked — confirmation on its way!', 'success');
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not book your table'), 'error'),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({ ...values, notes: values.notes?.trim() || undefined });
  };

  /* ----- success state ----- */
  if (result) {
    const r = result.reservation;
    return (
      <>
        <PageHeader eyebrow="Reservation confirmed" title="Locked In." />
        <section className="bg-black py-20">
          <div className="mx-auto max-w-2xl px-5 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            >
              <PartyPopper className="mx-auto text-yellow mb-4" size={56} />
              <h2 className="display text-red glow-red text-7xl md:text-9xl">You&apos;re Booked.</h2>
            </motion.div>

            <div className="mt-10 border-2 border-grey-mid bg-grey p-8 text-left">
              <p className="label text-white/40 mb-5">Booking summary</p>
              <dl className="space-y-3 font-mono text-sm">
                {[
                  ['Name', r.name],
                  ['Date', result.dateLabel],
                  ['Time', r.time],
                  ['Guests', String(r.guests)],
                  ['Where', SITE.address.full],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-grey-mid/60 pb-2">
                    <dt className="text-white/50 uppercase">{k}</dt>
                    <dd className="text-white text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-white/50 text-sm font-body">
                {result.emailSent
                  ? `A confirmation has been sent to ${r.email}.`
                  : `We've saved your booking. Confirmation email may take a minute.`}
              </p>
            </div>

            <button
              onClick={() => {
                setResult(null);
                reset();
              }}
              className="mt-8 inline-flex items-center gap-2 label text-white/60 hover:text-red transition-colors"
            >
              <RotateCcw size={16} /> Book another table
            </button>
          </div>
        </section>
      </>
    );
  }

  /* ----- form state ----- */
  return (
    <>
      <PageHeader
        eyebrow="Walk-ins always welcome"
        title={
          <>
            Book Your <span className="text-red">Table</span>
          </>
        }
      />

      <section className="bg-black py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-12">
          {/* info */}
          <div>
            <h2 className="display text-white text-4xl md:text-5xl mb-6">
              Pull Up. Sit Down. <span className="text-red">Dig In.</span>
            </h2>
            <p className="text-white/60 font-body text-lg leading-relaxed max-w-md">
              Reserve a table and skip the line. We hold every booking for 15 minutes — after that,
              the griddle waits for no one.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <Clock className="text-red shrink-0 mt-1" size={22} />
                <div className="w-full max-w-xs">
                  <p className="label text-white/40 mb-2">Hours</p>
                  <table className="w-full font-mono text-sm">
                    <tbody>
                      {SITE.hours.map((h) => (
                        <tr key={h.days} className="border-b border-grey-mid/60">
                          <td className="py-1.5 text-white/80 uppercase">{h.days}</td>
                          <td className="py-1.5 text-yellow text-right">{h.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="text-red shrink-0 mt-1" size={22} />
                <div>
                  <p className="label text-white/40 mb-1">Location</p>
                  <p className="font-body text-white">{SITE.address.full}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-l-2 border-yellow pl-4">
              <p className="font-display text-2xl text-yellow uppercase">Walk-ins always welcome</p>
              <p className="text-white/50 text-sm font-body mt-1">
                No table? Pull up a stool at the counter.
              </p>
            </div>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-grey border-2 border-grey-mid p-6 md:p-8 space-y-5"
            noValidate
          >
            <Input
              label="Full Name"
              required
              id="name"
              placeholder="Jordan Smith"
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Email"
                required
                id="email"
                type="email"
                placeholder="you@email.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Phone"
                required
                id="phone"
                type="tel"
                placeholder="(212) 555-0199"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Date"
                required
                id="date"
                type="date"
                min={today}
                error={errors.date?.message}
                {...register('date')}
              />
              <Select
                label="Time"
                required
                id="time"
                defaultValue=""
                error={errors.time?.message}
                {...register('time')}
              >
                <option value="" disabled>
                  Select a time
                </option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <Select
              label="Number of Guests"
              required
              id="guests"
              error={errors.guests?.message}
              {...register('guests')}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'guest' : 'guests'}
                </option>
              ))}
              <option value={11}>10+ (large party)</option>
            </Select>
            <Textarea
              label="Special Requests"
              id="notes"
              placeholder="Birthday, allergies, booth preference…"
              error={errors.notes?.message}
              {...register('notes')}
            />

            <Button type="submit" variant="red" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Booking…' : 'Book Table'}
            </Button>
            <p className="font-mono text-[11px] text-white/35 text-center">
              By booking you agree to our hold policy. We&apos;ll email you a confirmation.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
