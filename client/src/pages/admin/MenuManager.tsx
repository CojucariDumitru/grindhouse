import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  adminFetchMenu,
  toggleAvailability,
  deleteMenuItem,
} from '../../api/menu.api';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../components/ui/Toast';
import { FoodImage } from '../../components/ui/FoodImage';
import { AdminHeading } from './_components';
import { MenuItemModal } from './MenuItemModal';
import { CATEGORY_LABELS, type MenuItem } from '../../lib/types';

export default function MenuManager() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['admin-menu'], queryFn: adminFetchMenu });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-menu'] });
    qc.invalidateQueries({ queryKey: ['menu'] });
    qc.invalidateQueries({ queryKey: ['featured'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const toggleMutation = useMutation({
    mutationFn: toggleAvailability,
    onSuccess: (item) => {
      invalidate();
      toast(`${item.name} is now ${item.available ? 'available' : 'unavailable'}.`, 'info');
    },
    onError: (err) => toast(getErrorMessage(err), 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      invalidate();
      toast('Item deleted.', 'info');
    },
    onError: (err) => toast(getErrorMessage(err), 'error'),
  });

  const items = data ?? [];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <AdminHeading title="Menu Manager" subtitle={`${items.length} items on the board.`} />
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-red text-black font-display text-xl uppercase tracking-wide px-5 py-2.5 hover:bg-yellow hover:shadow-neon-sm transition-all"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      <div className="bg-grey border-2 border-grey-mid overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b-2 border-grey-mid">
              {['Item', 'Category', 'Price', 'Tags', 'Available', 'Actions'].map((h) => (
                <th key={h} className="label text-white/40 px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 font-mono text-white/40">
                  Loading…
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-b border-grey-mid/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FoodImage
                      src={item.image}
                      alt={item.name}
                      fallbackLabel={item.name.slice(0, 6)}
                      className="w-12 h-12 shrink-0 border border-grey-mid"
                    />
                    <div className="min-w-0">
                      <p className="font-body font-semibold text-white truncate max-w-[220px]">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-white/40 truncate max-w-[260px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-white/60 whitespace-nowrap">
                  {CATEGORY_LABELS[item.category]}
                </td>
                <td className="px-4 py-3 price-tag whitespace-nowrap">${item.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[140px]">
                    {item.isPopular && <Tag>★</Tag>}
                    {item.isNew && <Tag>NEW</Tag>}
                    {item.isSpicy && <Tag>🌶</Tag>}
                    {item.isVeg && <Tag>🌱</Tag>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleMutation.mutate(item.id)}
                    disabled={toggleMutation.isPending}
                    className={`relative w-12 h-6 border-2 transition-colors ${
                      item.available ? 'bg-red border-red' : 'bg-black border-grey-mid'
                    }`}
                    title={item.available ? 'Available' : 'Unavailable'}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${
                        item.available ? 'left-[26px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(item)}
                      className="p-2 border-2 border-grey-mid text-white/70 hover:border-red hover:text-red transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${item.name}"?`)) deleteMutation.mutate(item.id);
                      }}
                      className="p-2 border-2 border-grey-mid text-white/40 hover:border-white hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <MenuItemModal
          item={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            invalidate();
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] text-white/60 border border-grey-mid px-1.5 py-0.5">
      {children}
    </span>
  );
}
