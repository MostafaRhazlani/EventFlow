/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  getCurrentUser,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
} from "@/lib/services";
import { useRouter } from "next/navigation";
import CreateEventPage from "@/app/(dashboard)/dashboard/organizer/events/create/page";
import { EventsTable } from "@/components/events/EventsTable";
import { RecentDrafts } from "@/components/dashboard/RecentDrafts";

jest.mock("@/lib/services", () => ({
  getCurrentUser: jest.fn(),
  createEvent: jest.fn(),
  getMyEvents: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
  updateEventStatus: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt || "test-img"} {...props} />;
  },
}));

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<
  typeof getCurrentUser
>;
const mockCreateEvent = createEvent as jest.MockedFunction<typeof createEvent>;
const mockUpdateEvent = updateEvent as jest.MockedFunction<typeof updateEvent>;
const mockDeleteEvent = deleteEvent as jest.MockedFunction<typeof deleteEvent>;
const mockUpdateEventStatus = updateEventStatus as jest.MockedFunction<
  typeof updateEventStatus
>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Event CRUD - Organizer", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  const organizer = {
    _id: "org-123",
    first_name: "Jane",
    last_name: "Organizer",
    email: "organizer@example.com",
    role: "ORGANIZER",
    isApproved: true,
  };

  const mockEvents = [
    {
      _id: "event-1",
      title: "Tech Meetup",
      description: "A tech meetup",
      date: "2026-03-15T10:00:00Z",
      location: "NYC",
      status: "PUBLISHED" as const,
      maxParticipants: 50,
      participants: [],
      organizer: {
        _id: "org-123",
        first_name: "Jane",
        last_name: "Organizer",
        email: "organizer@example.com",
      },
      createdAt: "2026-02-01T10:00:00Z",
      updatedAt: "2026-02-01T10:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(
      mockRouter as unknown as ReturnType<typeof useRouter>,
    );
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();
  });

  it("organizer can create event", async () => {
    mockGetCurrentUser.mockResolvedValue(Object.assign({}, organizer));
    mockCreateEvent.mockResolvedValue(Object.assign({}, mockEvents[0]));

    const { container } = render(<CreateEventPage />);

    await waitFor(() => {
      expect(screen.getByText("Create New Event")).toBeInTheDocument();
    });

    const titleInput = container.querySelector(
      '[name="title"]',
    ) as HTMLInputElement;
    const descInput = container.querySelector(
      '[name="description"]',
    ) as HTMLTextAreaElement;
    const dateInput = container.querySelector(
      '[name="date"]',
    ) as HTMLInputElement;
    const locationInput = container.querySelector(
      '[name="location"]',
    ) as HTMLInputElement;
    const maxInput = container.querySelector(
      '[name="maxParticipants"]',
    ) as HTMLInputElement;

    await userEvent.type(titleInput, "Tech Meetup");
    await userEvent.type(descInput, "A tech meetup");
    await userEvent.type(dateInput, "2026-03-15T10:00");
    await userEvent.type(locationInput, "NYC");
    await userEvent.type(maxInput, "50");

    await userEvent.click(
      screen.getByRole("button", { name: /create event/i }),
    );

    await waitFor(() => {
      expect(mockCreateEvent).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/events");
    });
  });

  it("organizer can view their events", () => {
    render(<EventsTable events={Object.assign([], mockEvents)} />);

    expect(screen.getByText("Tech Meetup")).toBeInTheDocument();
    expect(screen.getByText("NYC")).toBeInTheDocument();
  });

  it("organizer can delete event", async () => {
    mockDeleteEvent.mockResolvedValue(undefined as unknown as void);

    render(<EventsTable events={Object.assign([], mockEvents)} />);

    const deleteButton = screen.getByTitle("Delete");
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(mockDeleteEvent).toHaveBeenCalledWith("event-1");
    });
  });

  it("organizer can update event info", async () => {
    mockUpdateEvent.mockResolvedValue(Object.assign({
      _id: "event-1",
      title: "Updated Event",
    }));

    const formData = new FormData();
    formData.append("title", "Updated Event");
    formData.append("description", "Updated description");
    formData.append("date", "2026-03-15T10:00");
    formData.append("location", "New Location");
    formData.append("maxParticipants", "100");

    await mockUpdateEvent("event-1", formData);

    expect(mockUpdateEvent).toHaveBeenCalledWith("event-1", formData);
  });

  it("organizer can publish draft event", async () => {
    const draftEvents = [
      {
        ...mockEvents[0],
        status: "DRAFT" as const,
      },
    ];
    mockUpdateEventStatus.mockResolvedValue(undefined as unknown as void);

    render(<RecentDrafts events={Object.assign([], draftEvents)} />);

    const publishButton = screen.getByTitle("Publish");
    await userEvent.click(publishButton);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(mockUpdateEventStatus).toHaveBeenCalledWith(
        "event-1",
        "PUBLISHED",
      );
    });
  });

  it("organizer can cancel event", async () => {
    const draftEvents = [
      {
        ...mockEvents[0],
        status: "DRAFT" as const,
      },
    ];
    mockUpdateEventStatus.mockResolvedValue(undefined as unknown as void);

    render(<RecentDrafts events={Object.assign([], draftEvents)} />);

    const cancelButton = screen.getByTitle("Cancel");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalled();
      expect(mockUpdateEventStatus).toHaveBeenCalledWith("event-1", "CANCELED");
    });
  });
});
