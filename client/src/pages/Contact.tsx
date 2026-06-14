import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Instagram, Twitter } from 'lucide-react';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { useToast } from '../components/ui/Toast';
import { sendContactMessage } from '../api/contact.api';
import { getErrorMessage } from '../api/client';
import { SITE } from '../lib/site';

const schema = z.object({
  name: z.string().min(2, 'Tell us your name'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(2, 'Add a subject'),
  message: z.string().min(5, 'Say a little more'),
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast('Message sent — we’ll be in touch.', 'success');
      reset();
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not send your message'), 'error'),
  });

  return (
    <>
      <PageHeader
        eyebrow="Say hello"
        title={
          <>
            Get In <span className="text-red">Touch</span>
          </>
        }
        subtitle="Catering, press, lost jackets, or just to tell us the Diablo changed your life."
      />

      <section className="bg-black py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 grid lg:grid-cols-[1.2fr_1fr] gap-12">
          {/* form */}
          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="bg-grey border-2 border-grey-mid p-6 md:p-8 space-y-5"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Name"
                required
                id="name"
                placeholder="Your name"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Email"
                required
                id="email"
                type="email"
                placeholder="you@email.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <Input
              label="Subject"
              required
              id="subject"
              placeholder="What's this about?"
              error={errors.subject?.message}
              {...register('subject')}
            />
            <Textarea
              label="Message"
              required
              id="message"
              placeholder="Type your message…"
              className="min-h-[160px]"
              error={errors.message?.message}
              {...register('message')}
            />
            <Button type="submit" variant="red" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Sending…' : 'Send Message'}
            </Button>
          </form>

          {/* details */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <Phone className="text-red shrink-0 mt-1" size={22} />
              <div>
                <p className="label text-white/40 mb-1">Phone</p>
                <a href={SITE.phoneHref} className="font-body text-white text-lg hover:text-red">
                  {SITE.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="text-red shrink-0 mt-1" size={22} />
              <div>
                <p className="label text-white/40 mb-1">Email</p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="font-body text-white text-lg hover:text-red"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="text-red shrink-0 mt-1" size={22} />
              <div>
                <p className="label text-white/40 mb-1">Address</p>
                <p className="font-body text-white text-lg">{SITE.address.full}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="label text-white/40 mb-3">Follow the grind</p>
              <div className="flex gap-3">
                <a
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-12 h-12 grid place-items-center border-2 border-grey-mid text-white hover:border-red hover:text-red transition-colors"
                >
                  <Instagram size={22} />
                </a>
                <a
                  href={SITE.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-12 h-12 grid place-items-center border-2 border-grey-mid text-white hover:border-red hover:text-red transition-colors"
                >
                  <Twitter size={22} />
                </a>
              </div>
            </div>

            <div className="border-l-2 border-yellow pl-4">
              <p className="font-display text-2xl text-yellow uppercase">Open till late</p>
              <p className="text-white/50 text-sm font-body mt-1">
                Kitchen runs till 2am Fri & Sat. Come through.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
