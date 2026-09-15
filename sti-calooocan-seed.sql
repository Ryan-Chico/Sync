-- STI College Caloocan - Building & Room Seed Data
-- Based on research: 10-storey building, 14,409 sqm
-- Room numbering follows floor+number pattern (e.g., 308 = floor 3, room 08)
-- Room numbers prefixed with 'SC' to avoid conflicts with other buildings

-- Delete existing data for this building (if re-running)
DELETE FROM rooms WHERE building = 'STI College Caloocan';
DELETE FROM buildings WHERE name = 'STI College Caloocan';

-- Insert STI College Caloocan building with custom dimensions
INSERT INTO buildings (id, name, floors, is_active, wing_width, wing_depth, side_width, side_depth, floor_height)
VALUES (
  gen_random_uuid(),
  'STI College Caloocan',
  10,
  true,
  10,    -- main wing width (scaled for larger building)
  8,     -- main wing depth
  5,     -- side wing width
  6,     -- side wing depth
  0.1    -- floor slab thickness
);

-- Floor 1: Lobby, Auditorium, Gym, Security
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC101', 'Main Lobby', 'Ground floor entrance and reception area', 50, 1, 'STI College Caloocan', '{}', true, 20, 20, 200, 150),
  ('SC102', 'Auditorium', 'Main auditorium for events and assemblies', 300, 1, 'STI College Caloocan', '{projector,microphone,sound_system}', true, 240, 20, 300, 150),
  ('SC103', 'Gymnasium', 'Full-sized gymnasium for sports activities', 200, 1, 'STI College Caloocan', '{}', true, 560, 20, 250, 150),
  ('SC104', 'Security Office', 'Campus security and CCTV monitoring', 5, 1, 'STI College Caloocan', '{}', true, 20, 190, 120, 80),
  ('SC105', 'Records Room', 'Student records and documents storage', 5, 1, 'STI College Caloocan', '{}', true, 160, 190, 120, 80),
  ('SC106', 'Clinic', 'Campus health clinic and first aid', 8, 1, 'STI College Caloocan', '{}', true, 300, 190, 120, 80),
  ('SC107', 'Canteen', 'Main cafeteria and dining area', 100, 1, 'STI College Caloocan', '{}', true, 440, 190, 200, 80),
  ('SC108', 'Guidance Office', 'Student guidance and counseling', 6, 1, 'STI College Caloocan', '{}', true, 660, 190, 120, 80);

-- Floor 2: Library
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC201', 'Main Library', 'Primary library reading area', 60, 2, 'STI College Caloocan', '{}', true, 20, 20, 300, 150),
  ('SC202', 'Reference Section', 'Reference books and materials', 30, 2, 'STI College Caloocan', '{}', true, 340, 20, 200, 150),
  ('SC203', 'Computer Lab A', 'Library computer laboratory', 30, 2, 'STI College Caloocan', '{computers,projector}', true, 560, 20, 250, 150),
  ('SC204', 'Media Center', 'Digital media and AV resources', 20, 2, 'STI College Caloocan', '{computers,projector}', true, 20, 190, 180, 80),
  ('SC205', 'Study Room 1', 'Group study room', 10, 2, 'STI College Caloocan', '{}', true, 220, 190, 120, 80),
  ('SC206', 'Study Room 2', 'Group study room', 10, 2, 'STI College Caloocan', '{}', true, 360, 190, 120, 80),
  ('SC207', 'Archives', 'Document archives and storage', 5, 2, 'STI College Caloocan', '{}', true, 500, 190, 120, 80),
  ('SC208', 'Librarian Office', 'Library administration', 4, 2, 'STI College Caloocan', '{}', true, 640, 190, 120, 80);

-- Floor 3: Classrooms (verified rooms 308, 311 exist)
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC301', 'Classroom 301', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 20, 140, 100),
  ('SC302', 'Classroom 302', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 20, 140, 100),
  ('SC303', 'Classroom 303', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 20, 140, 100),
  ('SC304', 'Classroom 304', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 20, 140, 100),
  ('SC305', 'Classroom 305', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 660, 20, 140, 100),
  ('SC306', 'Classroom 306', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 140, 140, 100),
  ('SC307', 'Classroom 307', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 140, 140, 100),
  ('SC308', 'Classroom 308', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 140, 140, 100),
  ('SC309', 'Classroom 309', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 140, 140, 100),
  ('SC310', 'Classroom 310', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 260, 140, 100),
  ('SC311', 'Classroom 311', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 260, 140, 100),
  ('SC312', 'Classroom 312', 'General classroom', 40, 3, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 260, 140, 100);

-- Floor 4: Classrooms + Labs (verified room 409B exists)
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC401', 'Classroom 401', 'General classroom', 40, 4, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 20, 140, 100),
  ('SC402', 'Classroom 402', 'General classroom', 40, 4, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 20, 140, 100),
  ('SC403', 'Classroom 403', 'General classroom', 40, 4, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 20, 140, 100),
  ('SC404', 'Classroom 404', 'General classroom', 40, 4, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 20, 140, 100),
  ('SC405', 'Classroom 405', 'General classroom', 40, 4, 'STI College Caloocan', '{projector,whiteboard}', true, 660, 20, 140, 100),
  ('SC406', 'Computer Lab B', 'IT laboratory with workstations', 30, 4, 'STI College Caloocan', '{computers,projector}', true, 20, 140, 180, 100),
  ('SC407', 'Computer Lab C', 'IT laboratory with workstations', 30, 4, 'STI College Caloocan', '{computers,projector}', true, 220, 140, 180, 100),
  ('SC408', 'Electronics Lab', 'Electronics and circuit laboratory', 25, 4, 'STI College Caloocan', '{computers,projector}', true, 420, 140, 180, 100),
  ('SC409A', 'Networking Lab A', 'Network configuration laboratory', 25, 4, 'STI College Caloocan', '{computers,projector}', true, 620, 140, 140, 100),
  ('SC409B', 'Networking Lab B', 'Network configuration laboratory', 25, 4, 'STI College Caloocan', '{computers,projector}', true, 20, 260, 180, 100),
  ('SC410', 'Faculty Room', 'Faculty office and workroom', 15, 4, 'STI College Caloocan', '{computers}', true, 220, 260, 140, 100);

-- Floor 5: Classrooms + Simulation Labs (verified room 505 exists)
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC501', 'Classroom 501', 'General classroom', 40, 5, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 20, 140, 100),
  ('SC502', 'Classroom 502', 'General classroom', 40, 5, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 20, 140, 100),
  ('SC503', 'Classroom 503', 'General classroom', 40, 5, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 20, 140, 100),
  ('SC504', 'Classroom 504', 'General classroom', 40, 5, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 20, 140, 100),
  ('SC505', 'Classroom 505', 'General classroom', 40, 5, 'STI College Caloocan', '{projector,whiteboard}', true, 660, 20, 140, 100),
  ('SC506', 'Simulation Lab A', 'IT simulation laboratory', 25, 5, 'STI College Caloocan', '{computers,projector}', true, 20, 140, 180, 100),
  ('SC507', 'Simulation Lab B', 'Business simulation laboratory', 25, 5, 'STI College Caloocan', '{computers,projector}', true, 220, 140, 180, 100),
  ('SC508', 'Programming Lab', 'Software development laboratory', 30, 5, 'STI College Caloocan', '{computers,projector}', true, 420, 140, 180, 100),
  ('SC509', 'Database Lab', 'Database administration laboratory', 25, 5, 'STI College Caloocan', '{computers,projector}', true, 620, 140, 140, 100),
  ('SC510', 'Technical Support', 'IT support and helpdesk', 8, 5, 'STI College Caloocan', '{computers}', true, 20, 260, 140, 100),
  ('SC511', 'Server Room', 'Network server and infrastructure', 5, 5, 'STI College Caloocan', '{}', true, 180, 260, 100, 100);

-- Floor 6: Classrooms (verified room 608 exists)
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC601', 'Classroom 601', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 20, 140, 100),
  ('SC602', 'Classroom 602', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 20, 140, 100),
  ('SC603', 'Classroom 603', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 20, 140, 100),
  ('SC604', 'Classroom 604', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 20, 140, 100),
  ('SC605', 'Classroom 605', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 660, 20, 140, 100),
  ('SC606', 'Classroom 606', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 140, 140, 100),
  ('SC607', 'Classroom 607', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 140, 140, 100),
  ('SC608', 'Classroom 608', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 140, 140, 100),
  ('SC609', 'Classroom 609', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 140, 140, 100),
  ('SC610', 'Classroom 610', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 260, 140, 100),
  ('SC611', 'Classroom 611', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 260, 140, 100),
  ('SC612', 'Classroom 612', 'General classroom', 40, 6, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 260, 140, 100);

-- Floor 7: Classrooms
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC701', 'Classroom 701', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 20, 140, 100),
  ('SC702', 'Classroom 702', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 20, 140, 100),
  ('SC703', 'Classroom 703', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 20, 140, 100),
  ('SC704', 'Classroom 704', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 20, 140, 100),
  ('SC705', 'Classroom 705', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 660, 20, 140, 100),
  ('SC706', 'Classroom 706', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 140, 140, 100),
  ('SC707', 'Classroom 707', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 140, 140, 100),
  ('SC708', 'Classroom 708', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 140, 140, 100),
  ('SC709', 'Classroom 709', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 140, 140, 100),
  ('SC710', 'Classroom 710', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 260, 140, 100),
  ('SC711', 'Classroom 711', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 260, 140, 100),
  ('SC712', 'Classroom 712', 'General classroom', 40, 7, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 260, 140, 100);

-- Floor 8: Classrooms + Specialized Labs
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC801', 'Classroom 801', 'General classroom', 40, 8, 'STI College Caloocan', '{projector,whiteboard}', true, 20, 20, 140, 100),
  ('SC802', 'Classroom 802', 'General classroom', 40, 8, 'STI College Caloocan', '{projector,whiteboard}', true, 180, 20, 140, 100),
  ('SC803', 'Classroom 803', 'General classroom', 40, 8, 'STI College Caloocan', '{projector,whiteboard}', true, 340, 20, 140, 100),
  ('SC804', 'Classroom 804', 'General classroom', 40, 8, 'STI College Caloocan', '{projector,whiteboard}', true, 500, 20, 140, 100),
  ('SC805', 'Classroom 805', 'General classroom', 40, 8, 'STI College Caloocan', '{projector,whiteboard}', true, 660, 20, 140, 100),
  ('SC806', 'Multimedia Lab', 'Digital media production lab', 25, 8, 'STI College Caloocan', '{computers,projector}', true, 20, 140, 180, 100),
  ('SC807', 'Graphics Lab', 'Computer graphics and design lab', 25, 8, 'STI College Caloocan', '{computers,projector}', true, 220, 140, 180, 100),
  ('SC808', 'Web Dev Lab', 'Web development laboratory', 30, 8, 'STI College Caloocan', '{computers,projector}', true, 420, 140, 180, 100),
  ('SC809', 'Cybersecurity Lab', 'Information security lab', 25, 8, 'STI College Caloocan', '{computers,projector}', true, 620, 140, 140, 100),
  ('SC810', 'Tech Support', 'Technical support office', 8, 8, 'STI College Caloocan', '{computers}', true, 20, 260, 140, 100);

-- Floor 9: Multi-purpose Hall, Classrooms
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC901', 'Multi-Purpose Hall', 'Large hall for events and gatherings', 150, 9, 'STI College Caloocan', '{projector,microphone,sound_system}', true, 20, 20, 400, 200),
  ('SC902', 'Classroom 902', 'General classroom', 40, 9, 'STI College Caloocan', '{projector,whiteboard}', true, 440, 20, 140, 100),
  ('SC903', 'Classroom 903', 'General classroom', 40, 9, 'STI College Caloocan', '{projector,whiteboard}', true, 600, 20, 140, 100),
  ('SC904', 'Conference Room', 'Meeting and conference room', 20, 9, 'STI College Caloocan', '{projector,conference_phone}', true, 20, 240, 160, 100),
  ('SC905', 'Seminar Room', 'Small seminar and workshop room', 30, 9, 'STI College Caloocan', '{projector,whiteboard}', true, 200, 240, 140, 100),
  ('SC906', 'Student Lounge', 'Student relaxation and study area', 40, 9, 'STI College Caloocan', '{}', true, 360, 240, 180, 100),
  ('SC907', 'Tutorial Room', 'Tutorial and remedial sessions', 15, 9, 'STI College Caloocan', '{whiteboard}', true, 560, 240, 140, 100);

-- Floor 10: Admin, Faculty, Executive
INSERT INTO rooms (room_number, name, description, capacity, floor, building, equipment, is_active, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height) VALUES
  ('SC1001', 'Executive Office', 'Campus director office', 5, 10, 'STI College Caloocan', '{computers}', true, 20, 20, 160, 100),
  ('SC1002', 'Admin Office', 'Administrative services', 10, 10, 'STI College Caloocan', '{computers}', true, 200, 20, 160, 100),
  ('SC1003', 'Registrar', 'Student records and enrollment', 15, 10, 'STI College Caloocan', '{computers}', true, 380, 20, 160, 100),
  ('SC1004', 'Accounting', 'Financial services and payments', 10, 10, 'STI College Caloocan', '{computers}', true, 560, 20, 140, 100),
  ('SC1005', 'HR Department', 'Human resources office', 8, 10, 'STI College Caloocan', '{computers}', true, 20, 140, 140, 100),
  ('SC1006', 'Faculty Room', 'Main faculty office', 20, 10, 'STI College Caloocan', '{computers}', true, 180, 140, 200, 100),
  ('SC1007', 'Conference Room', 'Executive meeting room', 15, 10, 'STI College Caloocan', '{projector,conference_phone}', true, 400, 140, 160, 100),
  ('SC1008', 'IT Department', 'Information technology office', 10, 10, 'STI College Caloocan', '{computers}', true, 580, 140, 140, 100),
  ('SC1009', 'Supply Room', 'Office supplies and inventory', 5, 10, 'STI College Caloocan', '{}', true, 20, 260, 120, 80),
  ('SC1010', 'Records Vault', 'Secure document storage', 3, 10, 'STI College Caloocan', '{}', true, 160, 260, 100, 80);

-- Verify the data
SELECT 
  b.name as building,
  b.floors,
  b.wing_width,
  b.wing_depth,
  b.side_width,
  b.side_depth,
  COUNT(r.id) as room_count
FROM buildings b
LEFT JOIN rooms r ON r.building = b.name AND r.is_active = true
WHERE b.name = 'STI College Caloocan'
GROUP BY b.name, b.floors, b.wing_width, b.wing_depth, b.side_width, b.side_depth;

SELECT 
  floor,
  COUNT(*) as rooms_on_floor,
  STRING_AGG(room_number, ', ' ORDER BY room_number) as room_numbers
FROM rooms
WHERE building = 'STI College Caloocan' AND is_active = true
GROUP BY floor
ORDER BY floor;
