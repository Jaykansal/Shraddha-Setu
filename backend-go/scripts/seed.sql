-- ShraddhaSetu PostgreSQL Seed Data

-- 1. Insert Master Pooja Services
INSERT INTO poojas (id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description)
VALUES 
('grah-shanti', 'Grah Shanti Pooja', 'For peace & domestic harmony', 1500, 600, 2100, '2 - 3 Hours', 'Lord Ganesha & Navagraha', 'DOSHA SHANTI', TRUE, '/images/pooja_grah_shanti.png', 'Pure Desi Cow Ghee (500g)|Navagraha Havan Samidha Sticks|Gangajal & Gulab Jal|Roli, Kumkum, Chandan, Akshat|Pooja Supari, Clove, Cardamom|Dhoop Cones & Pure Bhimseni Camphor', 'Brings peace, harmonizes domestic energies, and pacifies planetary obstacles from your household.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO poojas (id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description)
VALUES 
('maha-mrityunjaya', 'Maha Mrityunjaya Pooja', 'For health & protection', 1800, 700, 2500, '3 - 4 Hours', 'Lord Shiva', 'HEALTH', TRUE, '/images/pooja_mrityunjaya.png', 'Pure Belpatra & Dhatura Kit|Bhasma & Vibhuti|Panchamrit Samagri|Maha Mrityunjaya Havan Herbs|Black Sesame (Kala Til) & Jau|Rudraksha Japamala for Sankalp', 'Powerful Vedic mantra jaap and havan dedicated to Mahadev for health, protection, and overcoming distress.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO poojas (id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description)
VALUES 
('lakshmi-pooja', 'Lakshmi Pooja', 'For wealth & prosperity', 1300, 500, 1800, '2 Hours', 'Mata Lakshmi & Lord Kuber', 'WEALTH', TRUE, '/images/pooja_lakshmi.png', 'Kamal Gatta & Lotus Seeds|Kuber Kauri & Gomti Chakra|Pure Desi Ghee & Cotton Wicks|Rakt Chandan & Ashtagandha|Dry Fruits & Prasad Bhog Kit|Yellow Cloth & Mauli Dhaga', 'Spiritual invocations for wealth, financial stability, and auspicious abundance in home or business.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO poojas (id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description)
VALUES 
('satyanarayan-katha', 'Satyanarayan Katha', 'For happiness & well-being', 1600, 700, 2300, '2.5 Hours', 'Lord Vishnu (Satyanarayan)', 'HAVAN', TRUE, '/images/pooja_satyanarayan.png', 'Panchamrit & Tulsi Patra Kit|Panjiri Bhog & Prasad Samagri|Banana Leaves & Wooden Chowki Cloth|Havan Wood (Mango Wood Samidha)|Janeu Pairs & Supari|Pure Camphor & Deepam Oil', 'Sacred chapter-wise katha recitation of Bhagwan Satyanarayan followed by divine aarti and prasad.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO poojas (id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description)
VALUES 
('navagraha-shanti', 'Navagraha Shanti', 'For planetary balance', 2200, 900, 3100, '3 Hours', 'Nine Planetary Deities (Navagraha)', 'DOSHA SHANTI', TRUE, '/images/pooja_navagraha.png', '9 Planetary Grain Samagri (Navadhanya)|9 Colored Clothes for Navagraha|Navagraha Yantra & Havan Herb Blend|Pure Ghee & Guggal|Kusha Grass & Janeu|Chandan & Til', 'Pacifies adverse planetary transits, strengthens beneficial planets, and promotes overall peace and clarity.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO poojas (id, title, subtitle, price_without_samagri, samagri_cost, price_with_samagri, duration, deity, category, samagri_included, image, samagri_kit, description)
VALUES 
('griha-pravesh', 'Griha Pravesh Pooja', 'For auspicious new home', 2500, 1000, 3500, '4 Hours', 'Vastu Purush & Ganesha', 'VASTU', TRUE, '/images/pooja_griha_pravesh.png', 'Copper Kalash with Nariyal & Mango Leaves|Vastu Yantra & Toran (Bandanwar)|Complete Havan Kund Wood & Herbs|Cow Dung Cakes & Hawan Samidha|Pure Desi Ghee (1kg)|Roli, Chawal, Haldi, Supari, Janeu', 'Grand housewarming rituals including Vastu Shanti, Gauri-Ganesh Pujan, and Navagraha Havan.')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Users (Passwords hashed for 'shree108')
-- Password hash generated with bcrypt
INSERT INTO users (id, name, email, phone, password_hash, role, city, gurukul, vedic_specialization, experience_years, languages, is_verified, rating, poojas_conducted)
VALUES
('usr_admin_demo', 'Mandir Samiti Master Admin', 'admin@shraddhasetu.com', '+91 12345 67890', '$2a$10$wE96tO1P1/xJ6L529H9.te86s4X40oGqMflg.XqfBvJ2q5Q1b5S3e', 'ADMIN', 'Varanasi', '', '', 0, 'Hindi,English', TRUE, 5.0, 0),
('usr_client_demo', 'Rameshwar Devotee', 'devotee@shraddhasetu.com', '+91 98765 43210', '$2a$10$wE96tO1P1/xJ6L529H9.te86s4X40oGqMflg.XqfBvJ2q5Q1b5S3e', 'CLIENT', 'Varanasi', '', '', 0, 'Hindi', FALSE, 5.0, 0),
('usr_pandit_demo', 'Acharya Vidyadhar Shastri', 'pandit@shraddhasetu.com', '+91 98234 56789', '$2a$10$wE96tO1P1/xJ6L529H9.te86s4X40oGqMflg.XqfBvJ2q5Q1b5S3e', 'PANDIT', 'Varanasi', 'Sampurnanand Sanskrit University, Varanasi', 'Navagraha Shanti, Rudrabhishek & Griha Pravesh', 18, 'Hindi,Sanskrit,Bhojpuri', TRUE, 4.95, 1420),
('usr_p2', 'Pt. Rameshwar Dwivedi', 'rameshwar@shraddhasetu.com', '+91 98111 22233', '$2a$10$wE96tO1P1/xJ6L529H9.te86s4X40oGqMflg.XqfBvJ2q5Q1b5S3e', 'PANDIT', 'Mumbai / Pune', 'Maharshi Sandipani Rashtriya Veda Vidya Pratishthan', 'Maha Mrityunjaya Jaap & Vastu Shanti', 14, 'Hindi,Sanskrit,Marathi', TRUE, 4.92, 980)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demo Bookings
INSERT INTO bookings (id, booking_code, client_id, client_name, client_phone, client_email, pooja_id, pooja_title, with_samagri, base_price, samagri_price, total_amount, booking_date, time_slot, city, occasion, special_notes, status, assigned_pandit_id, assigned_pandit_name, assigned_pandit_phone)
VALUES
('bkg_demo_1', 'SS-1081', 'usr_client_demo', 'Rameshwar Devotee', '+91 98765 43210', 'devotee@shraddhasetu.com', 'griha-pravesh', 'Griha Pravesh Pooja', TRUE, 2500, 1000, 3500, '2026-10-18', 'Morning Auspicious Muhurat (08:30 AM)', 'Varanasi', 'Housewarming Ceremony', 'Kashyapa Gotra Sankalp', 'CONFIRMED', 'usr_pandit_demo', 'Acharya Vidyadhar Shastri', '+91 98234 56789'),
('bkg_demo_2', 'SS-1082', 'usr_client_demo', 'Rameshwar Devotee', '+91 98765 43210', 'devotee@shraddhasetu.com', 'maha-mrityunjaya', 'Maha Mrityunjaya Pooja', FALSE, 1800, 0, 1800, '2026-10-22', 'Evening Pradosh Kaal (05:30 PM)', 'Delhi NCR', 'Health & Well-being', 'Pandit Only, Devotee will arrange items', 'CONFIRMED', '', '', '')
ON CONFLICT (id) DO NOTHING;
