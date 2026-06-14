import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { adminFetchMessages, markMessageRead, deleteMessage } from '../../api/contact.api';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../components/ui/Toast';
import { AdminHeading } from './_components';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

export default function AdminMessages() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages', unreadOnly],
    queryFn: () => adminFetchMessages(unreadOnly),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-messages'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const readMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => markMessageRead(id, read),
    onSuccess: invalidate,
    onError: (err) => toast(getErrorMessage(err), 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      invalidate();
      toast('Message deleted.', 'info');
    },
    onError: (err) => toast(getErrorMessage(err), 'error'),
  });

  const messages = data ?? [];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <AdminHeading title="Messages" subtitle="Inbox from the contact form." />
        <label className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/70 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-red"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
          />
          Unread only
        </label>
      </div>

      {isLoading && <p className="font-mono text-white/40">Loading…</p>}
      {!isLoading && messages.length === 0 && (
        <p className="font-mono text-white/40">No messages.</p>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`bg-grey border-2 p-5 transition-colors ${
              m.read ? 'border-grey-mid' : 'border-red'
            }`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!m.read && <span className="w-2 h-2 bg-red rounded-full shrink-0" />}
                  <h3 className="font-body font-bold text-white">{m.subject}</h3>
                </div>
                <p className="font-mono text-xs text-white/40 mt-1">
                  {m.name} · {m.email} · {formatDate(m.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => readMutation.mutate({ id: m.id, read: !m.read })}
                  className="p-2 border-2 border-grey-mid text-white/60 hover:border-yellow hover:text-yellow transition-colors"
                  title={m.read ? 'Mark unread' : 'Mark read'}
                >
                  {m.read ? <Mail size={15} /> : <MailOpen size={15} />}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this message?')) deleteMutation.mutate(m.id);
                  }}
                  className="p-2 border-2 border-grey-mid text-white/40 hover:border-white hover:text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="mt-4 text-white/70 font-body leading-relaxed whitespace-pre-wrap">
              {m.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
