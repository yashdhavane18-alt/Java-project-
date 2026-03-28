-- Fix question marks in scheme data
-- Run this script to clean up any encoding issues in the database

UPDATE schemes SET 
    benefits = REPLACE(benefits, '?', ''),
    eligibility = REPLACE(eligibility, '?', ''),
    documents_required = REPLACE(documents_required, '?', ''),
    application_process = REPLACE(application_process, '?', ''),
    description = REPLACE(description, '?', '');

-- Also normalize bullet points
UPDATE schemes SET 
    benefits = REPLACE(REPLACE(benefits, '• ', '• '), '•', '• '),
    eligibility = REPLACE(REPLACE(eligibility, '• ', '• '), '•', '• '),
    documents_required = REPLACE(REPLACE(documents_required, '• ', '• '), '•', '• ');

-- Update Atal Pension Yojana specifically with clean data
UPDATE schemes SET 
    benefits = '• Guaranteed pension from Rs. 1000 to Rs. 5000\n• Government co-contribution\n• Tax benefits under Section 80CCD\n• Spouse continuation option',
    eligibility = '• Indian citizen\n• Age between 18-40 years\n• Bank account holder\n• Aadhaar number',
    documents_required = '• Aadhaar Card\n• Bank account details\n• Mobile number\n• Nominee details',
    application_process = '1. Visit bank or post office\n2. Fill APY registration form\n3. Submit Aadhaar and bank details\n4. Choose pension amount\n5. Auto-debit setup'
WHERE scheme_name = 'Atal Pension Yojana';

-- Verify the changes
SELECT scheme_name, benefits, eligibility, documents_required, application_process 
FROM schemes 
WHERE scheme_name = 'Atal Pension Yojana';
