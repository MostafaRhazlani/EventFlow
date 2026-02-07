'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getEvent, updateEvent } from '@/lib/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: '',
  });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [user, event] = await Promise.all([
            getCurrentUser(),
            getEvent(resolvedParams.id)
        ]);
        
        if (!user || user.role !== 'ORGANIZER') {
          router.push('/login');
          return;
        }

        // Pre-fill form
        setFormData({
            title: event.title,
            description: event.description,
            // Format date for input datetime-local: YYYY-MM-DDTHH:mm
            date: new Date(event.date).toISOString().slice(0, 16), 
            location: event.location,
            maxParticipants: event.maxParticipants.toString(),
        });
        if (event.image) setCurrentImage(event.image);

      } catch (err) {
        console.error(err);
        setError('Failed to load event or permission denied');
        // router.push('/dashboard/organizer/events');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [resolvedParams.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('location', formData.location);
      data.append('maxParticipants', formData.maxParticipants);
      
      if (newImage) {
        data.append('image', newImage);
      }

      await updateEvent(resolvedParams.id, data);
      router.push('/dashboard/organizer/events');
      router.refresh();
    } catch (err) {
      setError((err as any).response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-2">Update your event details</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-600 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Summer Music Festival"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
              placeholder="Tell people what your event is about..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <Input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Capacity
              </label>
              <Input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Central Park, NY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Image
            </label>
            
            {currentImage && !newImage && (
                <div className="mb-4 relative h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                     <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${currentImage.replace(/\\/g, '/')}`}
                        alt="Current event"
                        fill
                        className="object-cover"
                      />
                </div>
            )}

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors cursor-pointer bg-gray-50">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>Upload a new file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                {newImage && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    Selected: {newImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              isLoading={submitting}
            >
              Update Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
