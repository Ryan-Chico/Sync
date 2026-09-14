# Sync - Room Tracker

## Completed Features

### Authentication
- Email/password login and registration
- Admin and staff roles
- Protected routes (admin-only pages)
- Sign out

### Room Management
- Room browsing with search and filters (building, floor, equipment, status)
- Room detail page with info, capacity, equipment, and upcoming bookings
- Room status: available (green), occupied (red), maintenance (yellow)
- Real-time room status updates

### Room Booking
- Book a room with title, description, date, and time
- **Conflict prevention** - database trigger blocks overlapping bookings
- View upcoming bookings per room with who booked it
- Cancel bookings (owner or admin only)
- My Bookings page (active + past bookings)

### Room Dashboard
- Real-time room grid grouped by building
- Quick filters (available now, equipment, search)
- Click room → bottom sheet with Book / Report Issue / Details actions
- Stats bar (total, available, occupied, issues)

### Floor Plan
- 2D SVG grid view with auto-layout
- 3D L-shaped building view (React Three Fiber)
- Orbit controls (rotate, zoom, pan)
- Floor selector with room counts
- Room click → booking or issue reporting
- Billboarding floor labels (always face camera)

### Equipment Issue Reporting
- Report equipment issues from Dashboard or Floor Plan
- Admin verify/fix workflow (reported → verified → fixed)
- Issue count badges on room cards

### Home Page
- Stats cards (total, available, occupied)
- Available rooms list with "Book Now" button
- Occupied rooms list

### Admin Panel
- Dashboard with stats and recent bookings
- Manage Rooms (CRUD)
- Manage Buildings (CRUD)
- Manage Equipment (CRUD)
- User management (promote/demote roles)
- General settings (app configuration)

---

## Potential Next Steps

| Feature | Description |
|---------|-------------|
| **Notifications** | Notify users when their booking is cancelled, or when an issue is fixed |
| **Booking editing** | Allow users to edit/modify existing bookings |
| **Recurring bookings** | Book a room for weekly meetings |
| **Room photos** | Add images to rooms |
| **Email reminders** | Send reminders before a booking starts |
| **Capacity-based filtering** | Filter rooms by minimum capacity on home/dashboard |
| **Dark mode** | Theme toggle for light/dark mode |
| **Mobile PWA** | Make it installable on phones |
| **Booking history** | Show completed bookings with analytics |
