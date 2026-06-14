import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { X, Upload, Loader2 } from 'lucide-react';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FoodImage } from '../../components/ui/FoodImage';
import { useToast } from '../../components/ui/Toast';
import {
  createMenuItem,
  updateMenuItem,
  uploadMenuImage,
  type MenuItemInput,
} from '../../api/menu.api';
import { getErrorMessage } from '../../api/client';
import { CATEGORY_LABELS, type MenuItem, type MenuCategory } from '../../lib/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  category: z.string().min(1),
  calories: z.union([z.coerce.number().int().nonnegative(), z.literal('')]).optional(),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isVeg: z.boolean().optional(),
  available: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = Object.keys(CATEGORY_LABELS) as MenuCategory[];

const FLAGS: { key: keyof FormValues; label: string }[] = [
  { key: 'isPopular', label: 'Popular' },
  { key: 'isNew', label: 'New' },
  { key: 'isSpicy', label: 'Spicy' },
  { key: 'isVeg', label: 'Veg' },
  { key: 'available', label: 'Available' },
];

export function MenuItemModal({
  item,
  onClose,
  onSaved,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const isEdit = Boolean(item);
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image ?? null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name ?? '',
      description: item?.description ?? '',
      price: item?.price ?? undefined,
      category: item?.category ?? 'BURGERS',
      calories: item?.calories ?? '',
      isPopular: item?.isPopular ?? false,
      isNew: item?.isNew ?? false,
      isSpicy: item?.isSpicy ?? false,
      isVeg: item?.isVeg ?? false,
      available: item?.available ?? true,
    },
  });

  const save = useMutation({
    mutationFn: (payload: MenuItemInput) =>
      isEdit ? updateMenuItem(item!.id, payload) : createMenuItem(payload),
    onSuccess: () => {
      toast(isEdit ? 'Item updated.' : 'Item added.', 'success');
      onSaved();
    },
    onError: (err) => toast(getErrorMessage(err), 'error'),
  });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please choose an image file.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      setUploading(true);
      try {
        const url = await uploadMenuImage(dataUri);
        setImageUrl(url);
        toast('Image uploaded.', 'success');
      } catch (err) {
        toast(getErrorMessage(err, 'Image upload failed'), 'error');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: FormValues) => {
    save.mutate({
      name: values.name,
      description: values.description,
      price: values.price,
      category: values.category as MenuCategory,
      calories: values.calories === '' || values.calories == null ? null : Number(values.calories),
      image: imageUrl,
      isPopular: values.isPopular,
      isNew: values.isNew,
      isSpicy: values.isSpicy,
      isVeg: values.isVeg,
      available: values.available,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-grey border-2 border-red w-full max-w-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-grey-mid sticky top-0 bg-grey">
          <h2 className="font-display text-3xl text-white tracking-wide">
            {isEdit ? 'Edit Item' : 'New Item'}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-red" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* image */}
          <div className="flex gap-4 items-center">
            <FoodImage
              src={imageUrl}
              alt="Preview"
              fallbackLabel="No image"
              className="w-24 h-24 border-2 border-grey-mid shrink-0"
            />
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer border-2 border-grey-mid text-white px-4 py-2 hover:border-red transition-colors font-mono text-xs uppercase tracking-wider">
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                {uploading ? 'Uploading…' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
              <p className="font-mono text-[11px] text-white/30 mt-2">
                Uploaded to Cloudinary. Max ~10MB.
              </p>
            </div>
          </div>

          <Input label="Name" required id="m-name" error={errors.name?.message} {...register('name')} />
          <Textarea
            label="Description"
            required
            id="m-desc"
            className="min-h-[90px]"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Price ($)"
              required
              id="m-price"
              type="number"
              step="0.01"
              error={errors.price?.message}
              {...register('price')}
            />
            <Select label="Category" id="m-cat" {...register('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
            <Input
              label="Calories"
              id="m-cal"
              type="number"
              placeholder="optional"
              {...register('calories')}
            />
          </div>

          {/* flags */}
          <div className="flex flex-wrap gap-4 pt-1">
            {FLAGS.map((f) => (
              <label
                key={f.key}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/70 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-red"
                  {...register(f.key as keyof FormValues)}
                />
                {f.label}
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="red" disabled={save.isPending || uploading}>
              {save.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Item'}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="font-display text-xl uppercase tracking-wide text-white/50 hover:text-white px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
