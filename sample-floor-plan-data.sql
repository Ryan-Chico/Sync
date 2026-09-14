-- Sample Floor Plan Data for Rooms
-- Run this in Supabase SQL Editor after adding the floor_plan columns

-- Science Building - Floor 1 (Computer Labs)
UPDATE rooms SET floor_plan_x = 20, floor_plan_y = 20, floor_plan_width = 140, floor_plan_height = 100
WHERE room_number = '101' AND building = 'Science Building';

UPDATE rooms SET floor_plan_x = 180, floor_plan_y = 20, floor_plan_width = 140, floor_plan_height = 100
WHERE room_number = '102' AND building = 'Science Building';

-- Main Building - Floor 2 (Lecture Halls)
UPDATE rooms SET floor_plan_x = 20, floor_plan_y = 20, floor_plan_width = 200, floor_plan_height = 120
WHERE room_number = '201' AND building = 'Main Building';

UPDATE rooms SET floor_plan_x = 240, floor_plan_y = 20, floor_plan_width = 200, floor_plan_height = 120
WHERE room_number = '202' AND building = 'Main Building';

-- Admin Building - Floor 3 (Meeting Rooms)
UPDATE rooms SET floor_plan_x = 20, floor_plan_y = 20, floor_plan_width = 160, floor_plan_height = 100
WHERE room_number = '301' AND building = 'Admin Building';

UPDATE rooms SET floor_plan_x = 200, floor_plan_y = 20, floor_plan_width = 160, floor_plan_height = 100
WHERE room_number = '302' AND building = 'Admin Building';

-- Library - Floor 4 (Study Rooms)
UPDATE rooms SET floor_plan_x = 20, floor_plan_y = 20, floor_plan_width = 120, floor_plan_height = 80
WHERE room_number = '401' AND building = 'Library';

UPDATE rooms SET floor_plan_x = 160, floor_plan_y = 20, floor_plan_width = 120, floor_plan_height = 80
WHERE room_number = '402' AND building = 'Library';

-- Main Building - Floor 1 (Auditorium)
UPDATE rooms SET floor_plan_x = 20, floor_plan_y = 20, floor_plan_width = 300, floor_plan_height = 150
WHERE room_number = '501' AND building = 'Main Building';

-- Verify the updates
SELECT room_number, name, building, floor, floor_plan_x, floor_plan_y, floor_plan_width, floor_plan_height
FROM rooms
ORDER BY building, floor, room_number;
