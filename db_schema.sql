-- Database Schema for Accessible Government Scheme Finder
-- Create Database
CREATE DATABASE IF NOT EXISTS government_schemes_db;
USE government_schemes_db;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    caste ENUM('General', 'OBC', 'SC', 'ST') NOT NULL,
    income ENUM('<1 Lakh', '1-3 Lakh', '3-5 Lakh', '>5 Lakh') NOT NULL,
    profession ENUM('Student', 'Farmer', 'Housewife', 'Employed', 'Unemployed', 'Senior Citizen') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schemes Table
CREATE TABLE schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    benefits TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    documents_required TEXT NOT NULL,
    application_process TEXT NOT NULL,
    official_link VARCHAR(500),
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 100,
    target_gender ENUM('Male', 'Female', 'Other', 'Any') DEFAULT 'Any',
    target_caste ENUM('General', 'OBC', 'SC', 'ST', 'Any') DEFAULT 'Any',
    max_income ENUM('<1 Lakh', '1-3 Lakh', '3-5 Lakh', '>5 Lakh', 'Any') DEFAULT 'Any',
    target_profession ENUM('Student', 'Farmer', 'Housewife', 'Employed', 'Unemployed', 'Senior Citizen', 'Any') DEFAULT 'Any',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookmarks Table
CREATE TABLE bookmarks (
    bookmark_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scheme_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_bookmark (user_id, scheme_id)
);

-- Add Full-Text Search Index for schemes
ALTER TABLE schemes ADD FULLTEXT(scheme_name, summary, description);

-- Insert Sample Schemes
INSERT INTO schemes (scheme_name, summary, description, benefits, eligibility, documents_required, application_process, official_link, min_age, max_age, target_gender, target_caste, max_income, target_profession) VALUES

('Pradhan Mantri Jan Dhan Yojana', 'Financial inclusion scheme providing banking services to all households', 'A national mission for financial inclusion to ensure access to financial services, namely Banking Savings & Deposit Accounts, Remittance, Credit, Insurance, Pension in an affordable manner.', '• Zero balance account\n• RuPay Debit Card\n• Accident insurance cover of Rs. 2 lakh\n• Life insurance cover of Rs. 30,000', '• Indian citizen\n• No existing bank account\n• Valid identity proof', '• Aadhaar Card\n• PAN Card\n• Voter ID\n• Passport (any one)', '1. Visit nearest bank branch\n2. Fill account opening form\n3. Submit required documents\n4. Complete KYC process\n5. Receive account details', 'https://www.pmjdy.gov.in/', 18, 100, 'Any', 'Any', 'Any', 'Any'),

('Beti Bachao Beti Padhao', 'Scheme to save and educate girl child', 'Government initiative aimed at generating awareness and improving the efficiency of welfare services intended for girls in India.', '• Financial assistance for girl child education\n• Improved child sex ratio\n• Enhanced enrollment of girls in schools\n• Reduced gender discrimination', '• Girl child\n• Indian citizen\n• Below poverty line families get priority', '• Birth Certificate\n• Aadhaar Card\n• Income Certificate\n• School enrollment proof', '1. Apply through Anganwadi centers\n2. Submit required documents\n3. Verification by officials\n4. Approval and fund transfer', 'https://wcd.nic.in/bbbp-scheme', 0, 18, 'Female', 'Any', '3-5 Lakh', 'Any'),

('PM Kisan Samman Nidhi', 'Income support to farmer families', 'Central Sector Scheme providing income support to all landholding farmer families across the country to supplement their financial needs for procuring various inputs related to agriculture.', '• Rs. 6000 per year in three installments\n• Direct benefit transfer to bank account\n• No paperwork for renewal\n• Immediate financial relief', '• Landholding farmer families\n• Valid land records\n• Active bank account\n• Aadhaar linked mobile number', '• Land ownership documents\n• Aadhaar Card\n• Bank account details\n• Mobile number', '1. Register on PM-Kisan portal\n2. Fill farmer details\n3. Upload land documents\n4. Aadhaar verification\n5. Bank account linking', 'https://pmkisan.gov.in/', 18, 100, 'Any', 'Any', 'Any', 'Farmer'),

('Ayushman Bharat Pradhan Mantri Jan Arogya Yojana', 'Health insurance scheme for poor families', 'World\'s largest health insurance scheme providing coverage of Rs. 5 lakh per family per year for secondary and tertiary care hospitalization.', '• Health cover of Rs. 5 lakh per family per year\n• Cashless treatment at empaneled hospitals\n• Coverage for pre and post hospitalization\n• No restrictions on family size and age', '• Socio-Economic Caste Census (SECC) beneficiaries\n• Rural and urban poor families\n• As per deprivation criteria', '• Aadhaar Card\n• Ration Card\n• SECC verification\n• Mobile number', '1. Check eligibility on official website\n2. Visit nearest Common Service Center\n3. Generate Ayushman Bharat card\n4. Use card at empaneled hospitals', 'https://pmjay.gov.in/', 0, 100, 'Any', 'Any', '1-3 Lakh', 'Any'),

('Pradhan Mantri Awas Yojana', 'Housing for all scheme', 'Government initiative to provide affordable housing to urban and rural poor with a target to build 2 crore houses by 2022.', '• Interest subsidy on home loans\n• Direct financial assistance\n• Affordable housing options\n• Infrastructure development', '• Economically Weaker Section (EWS)\n• Low Income Group (LIG)\n• Middle Income Group (MIG)\n• First-time home buyers', '• Income Certificate\n• Aadhaar Card\n• Bank statements\n• Property documents\n• Employment proof', '1. Apply online on official portal\n2. Submit required documents\n3. Verification by authorities\n4. Approval and subsidy disbursement', 'https://pmaymis.gov.in/', 21, 70, 'Any', 'Any', '3-5 Lakh', 'Any'),

('National Scholarship Portal', 'Scholarships for students from various backgrounds', 'One-stop solution for students seeking scholarships from Central Government, State Government and other sources.', '• Financial assistance for education\n• Merit-based and need-based scholarships\n• Direct benefit transfer\n• Reduced dropout rates', '• Students from SC/ST/OBC/Minority communities\n• Merit criteria as per scheme\n• Income criteria as applicable\n• Regular student status', '• Educational certificates\n• Caste certificate\n• Income certificate\n• Aadhaar Card\n• Bank account details', '1. Register on NSP portal\n2. Fill application form\n3. Upload required documents\n4. Submit application\n5. Track application status', 'https://scholarships.gov.in/', 16, 25, 'Any', 'SC', '1-3 Lakh', 'Student'),

('Pradhan Mantri Ujjwala Yojana', 'Free LPG connections to women from BPL households', 'Scheme to provide LPG connections to women from Below Poverty Line (BPL) households to reduce their dependence on traditional cooking fuels.', '• Free LPG connection\n• Financial assistance for first refill\n• EMI facility for stove and hotplate\n• Improved health outcomes', '• Women from BPL households\n• Age 18 years or above\n• Not having LPG connection in household\n• Valid identity proof', '• BPL Card\n• Aadhaar Card\n• Bank account details\n• Address proof\n• Photograph', '1. Apply at LPG distributor\n2. Submit required documents\n3. Verification by officials\n4. Connection installation\n5. First refill assistance', 'https://www.pmujjwalayojana.com/', 18, 100, 'Female', 'Any', '1-3 Lakh', 'Housewife'),

('Atal Pension Yojana', 'Pension scheme for unorganized sector workers', 'Government backed pension scheme for citizens of India focused on the unorganized sector workers.', '• Guaranteed pension from Rs. 1000 to Rs. 5000\n• Government co-contribution\n• Tax benefits under Section 80CCD\n• Spouse continuation option', '• Indian citizen\n• Age between 18-40 years\n• Bank account holder\n• Aadhaar number', '• Aadhaar Card\n• Bank account details\n• Mobile number\n• Nominee details', '1. Visit bank or post office\n2. Fill APY registration form\n3. Submit Aadhaar and bank details\n4. Choose pension amount\n5. Auto-debit setup', 'https://npscra.nsdl.co.in/atal-pension-yojana.php', 18, 40, 'Any', 'Any', 'Any', 'Any'),

('Stand Up India', 'Bank loans for SC/ST and women entrepreneurs', 'Scheme to promote entrepreneurship among women and Scheduled Caste (SC) & Scheduled Tribe (ST) communities.', '• Bank loans between Rs. 10 lakh to Rs. 1 crore\n• Composite loan for setting up greenfield enterprises\n• Handholding support\n• Credit guarantee coverage', '• Women entrepreneurs\n• SC/ST entrepreneurs\n• Age 18 years and above\n• At least Class X pass', '• Project report\n• Identity and address proof\n• Caste certificate (for SC/ST)\n• Educational certificates\n• Experience certificates', '1. Prepare detailed project report\n2. Apply at designated bank branch\n3. Submit required documents\n4. Bank evaluation and approval\n5. Loan disbursement', 'https://www.standupmitra.in/', 18, 65, 'Any', 'SC', 'Any', 'Unemployed'),

('Sukanya Samriddhi Yojana', 'Savings scheme for girl child', 'Small savings scheme for the girl child launched as a part of the Beti Bachao Beti Padhao campaign.', '• High interest rate (currently 7.6%)\n• Tax benefits under Section 80C\n• Maturity amount tax-free\n• Partial withdrawal facility', '• Girl child below 10 years\n• Indian resident\n• Maximum 2 accounts per family\n• Minimum deposit Rs. 250 per year', '• Birth certificate of girl child\n• Identity proof of guardian\n• Address proof\n• Photographs', '1. Visit post office or authorized bank\n2. Fill account opening form\n3. Submit required documents\n4. Make initial deposit\n5. Receive passbook', 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=61', 0, 10, 'Female', 'Any', 'Any', 'Any');

-- Analytics: Scheme Views
CREATE TABLE IF NOT EXISTS scheme_views (
    view_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    scheme_id INT NOT NULL,
    source ENUM('search', 'recommendation', 'bookmark', 'direct') DEFAULT 'direct',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
);

-- Analytics: Search Logs
CREATE TABLE IF NOT EXISTS search_logs (
    search_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    keyword VARCHAR(255),
    filters TEXT,
    results_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
