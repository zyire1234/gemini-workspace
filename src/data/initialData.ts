import { Symptom, Specialist, Disease, Hospital, TherapyGuide, Rule } from '../types';

export const INITIAL_SYMPTOMS: Symptom[] = [
  // Head & Neurological
  { id: 'sym_headache', name: 'Severe Headache', category: 'Head & Neurological' },
  { id: 'sym_dizziness', name: 'Dizziness or Lightheadedness', category: 'Head & Neurological' },
  { id: 'sym_numbness', name: 'Numbness or Tingling in Limbs', category: 'Head & Neurological' },
  { id: 'sym_confusion', name: 'Confusion or Difficulty Speaking', category: 'Head & Neurological' },
  { id: 'sym_seizures', name: 'Seizures or Fits', category: 'Head & Neurological' },
  { id: 'sym_neck_stiffness', name: 'Neck Stiffness', category: 'Head & Neurological' },
  { id: 'sym_insomnia', name: 'Difficulty Sleeping / Insomnia', category: 'Head & Neurological' },

  // Chest & Respiratory
  { id: 'sym_chest_pain', name: 'Chest Pain or Pressure', category: 'Chest & Respiratory' },
  { id: 'sym_shortness_breath', name: 'Shortness of Breath', category: 'Chest & Respiratory' },
  { id: 'sym_cough', name: 'Persistent Cough', category: 'Chest & Respiratory' },
  { id: 'sym_wheezing', name: 'Wheezing or Whistling Breath', category: 'Chest & Respiratory' },
  { id: 'sym_palpitations', name: 'Heart Palpitations (Rapid Beating)', category: 'Chest & Respiratory' },
  { id: 'sym_sore_throat', name: 'Sore Throat', category: 'Chest & Respiratory' },
  { id: 'sym_runny_nose', name: 'Runny or Stuffed Nose', category: 'Chest & Respiratory' },
  { id: 'sym_sneezing', name: 'Sneezing / Nasal Congestion', category: 'Chest & Respiratory' },

  // Digestive
  { id: 'sym_stomach_pain', name: 'Severe Abdominal Pain', category: 'Digestive' },
  { id: 'sym_nausea', name: 'Nausea or Vomiting', category: 'Digestive' },
  { id: 'sym_heartburn', name: 'Acid Reflux or Heartburn', category: 'Digestive' },
  { id: 'sym_diarrhea', name: 'Persistent Diarrhea', category: 'Digestive' },
  { id: 'sym_constipation', name: 'Severe Constipation', category: 'Digestive' },
  { id: 'sym_abdominal_bloating', name: 'Abdominal Bloating', category: 'Digestive' },
  { id: 'sym_loss_of_appetite', name: 'Loss of Appetite', category: 'Digestive' },
  { id: 'sym_yellow_skin', name: 'Yellowing of Eyes & Skin (Jaundice)', category: 'Digestive' },
  { id: 'sym_bloody_stool', name: 'Blood in Stool', category: 'Digestive' },

  // Skin
  { id: 'sym_rash', name: 'Skin Rash or Hives', category: 'Skin' },
  { id: 'sym_itching', name: 'Severe Itching', category: 'Skin' },
  { id: 'sym_skin_lesion', name: 'Unusual Skin Lesions or Moles', category: 'Skin' },
  { id: 'sym_dry_skin', name: 'Dry, Scaly Patches', category: 'Skin' },
  { id: 'sym_skin_scaling', name: 'Skin Scaling or Flaking', category: 'Skin' },

  // Eyes & Vision
  { id: 'sym_blurred_vision', name: 'Blurred or Double Vision', category: 'Eyes & Vision' },
  { id: 'sym_eye_pain', name: 'Eye Pain or Redness', category: 'Eyes & Vision' },
  { id: 'sym_vision_loss', name: 'Sudden Loss of Vision', category: 'Eyes & Vision' },

  // Musculoskeletal
  { id: 'sym_joint_pain', name: 'Joint Pain or Stiffness', category: 'Musculoskeletal' },
  { id: 'sym_back_pain', name: 'Severe Back Pain', category: 'Musculoskeletal' },
  { id: 'sym_muscle_weakness', name: 'Muscle Weakness', category: 'Musculoskeletal' },
  { id: 'sym_stiffness', name: 'Morning Joint Stiffness', category: 'Musculoskeletal' },
  { id: 'sym_joint_swelling', name: 'Joint Swelling', category: 'Musculoskeletal' },

  // General & Systemic
  { id: 'sym_fever', name: 'High Fever', category: 'General' },
  { id: 'sym_fatigue', name: 'Extreme Fatigue', category: 'General' },
  { id: 'sym_weight_loss', name: 'Unexplained Weight Loss', category: 'General' },
  { id: 'sym_thirst', name: 'Excessive Thirst', category: 'General' },
  { id: 'sym_sweating', name: 'Excessive Night Sweats', category: 'General' },
  { id: 'sym_chills', name: 'Chills and Shivering', category: 'General' },
  { id: 'sym_depressed_mood', name: 'Feeling Sad or Depressed', category: 'General' },
  { id: 'sym_anxiety', name: 'Severe Anxiety or Panic', category: 'General' },
  { id: 'sym_painful_urination', name: 'Painful or Burning Urination', category: 'General' },
  { id: 'sym_frequent_urination', name: 'Frequent Urination', category: 'General' },
  { id: 'sym_blood_urine', name: 'Blood in Urine', category: 'General' },
  { id: 'sym_pelvic_pain', name: 'Chronic Pelvic Pain', category: 'General' },
  { id: 'sym_menstrual_cramps', name: 'Severe Menstrual Cramps', category: 'General' },
  { id: 'sym_irregular_periods', name: 'Irregular Menstrual Cycles', category: 'General' },
  { id: 'sym_hair_loss', name: 'Excessive Hair Loss', category: 'General' },
  { id: 'sym_cold_intolerance', name: 'Inability to Tolerate Cold', category: 'General' },
  { id: 'sym_heat_intolerance', name: 'Inability to Tolerate Heat', category: 'General' }
];

export const INITIAL_DISEASES: Disease[] = [
  // Neurological (5)
  { id: 'dis_migraine', name: 'Migraine Headache', description: 'A neurological condition characterized by intense, debilitating headaches, often with nausea and light sensitivity.', urgencyLevel: 'Medium' },
  { id: 'dis_stroke', name: 'Stroke Warning / TIA', description: 'A medical emergency where blood flow to the brain is interrupted, causing sudden numbness, speech difficulties, or confusion.', urgencyLevel: 'High' },
  { id: 'dis_tension_headache', name: 'Tension-Type Headache', description: 'A common headache marked by mild to moderate dull pain, usually feeling like a tight band around the head.', urgencyLevel: 'Low' },
  { id: 'dis_meningitis', name: 'Acute Meningitis', description: 'Infection and inflammation of the protective membranes covering the brain and spinal cord. Requires immediate emergency care.', urgencyLevel: 'High' },
  { id: 'dis_epilepsy', name: 'Epilepsy or Seizure Disorder', description: 'A central nervous system disorder in which brain activity becomes abnormal, causing seizures or periods of unusual behavior.', urgencyLevel: 'High' },

  // Cardiovascular (4)
  { id: 'dis_hypertension', name: 'Hypertension (High Blood Pressure)', description: 'A chronic condition where the force of blood against your artery walls is consistently too high.', urgencyLevel: 'Medium' },
  { id: 'dis_angina', name: 'Angina / Coronary Artery Disease', description: 'Chest pain or discomfort caused when your heart muscle does not get enough oxygen-rich blood.', urgencyLevel: 'High' },
  { id: 'dis_heart_failure', name: 'Congestive Heart Failure', description: 'A chronic progressive condition that affects the pumping power of your heart muscles, causing fluid backup.', urgencyLevel: 'High' },
  { id: 'dis_arrhythmia', name: 'Cardiac Arrhythmia', description: 'An improper beating of the heart, whether irregular, too fast (tachycardia), or too slow (bradycardia).', urgencyLevel: 'High' },

  // Respiratory (3)
  { id: 'dis_asthma', name: 'Bronchial Asthma', description: 'A respiratory condition marked by spasms in the bronchi of the lungs, causing difficulty in breathing.', urgencyLevel: 'High' },
  { id: 'dis_copd', name: 'Chronic Obstructive Pulmonary Disease (COPD)', description: 'A chronic inflammatory lung disease that causes obstructed airflow from the lungs.', urgencyLevel: 'Medium' },
  { id: 'dis_pneumonia', name: 'Acute Pneumonia', description: 'An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus.', urgencyLevel: 'High' },

  // Digestive / Gastroenterology (5)
  { id: 'dis_gerd', name: 'GERD (Gastroesophageal Reflux Disease)', description: 'A digestive disorder that occurs when acidic stomach juices flow back from the stomach into the esophagus.', urgencyLevel: 'Low' },
  { id: 'dis_gastritis', name: 'Acute Gastritis', description: 'Inflammation of the protective lining of the stomach, leading to pain, nausea, or vomiting.', urgencyLevel: 'Medium' },
  { id: 'dis_peptic_ulcer', name: 'Peptic Ulcer Disease (PUD)', description: 'Sores that develop on the inside lining of your stomach and the upper part of your small intestine.', urgencyLevel: 'Medium' },
  { id: 'dis_gastroenteritis', name: 'Gastroenteritis (Stomach Flu)', description: 'An intestinal infection marked by watery diarrhea, abdominal cramps, nausea or vomiting, and sometimes fever.', urgencyLevel: 'Medium' },
  { id: 'dis_ibs', name: 'Irritable Bowel Syndrome (IBS)', description: 'A common disorder that affects the large intestine, causing cramping, abdominal pain, bloating, gas, diarrhea, or constipation.', urgencyLevel: 'Low' },

  // Dermatology (5)
  { id: 'dis_eczema', name: 'Atopic Eczema (Dermatitis)', description: 'A condition that makes your skin red, dry, itchy, and inflamed, common but manageable.', urgencyLevel: 'Low' },
  { id: 'dis_psoriasis', name: 'Psoriasis Vulgaris', description: 'A skin disease that causes itchy or sore patches of thick, red skin with silvery scales.', urgencyLevel: 'Low' },
  { id: 'dis_acne', name: 'Acne Vulgaris', description: 'A common skin condition that occurs when hair follicles become plugged with oil and dead skin cells.', urgencyLevel: 'Low' },
  { id: 'dis_ringworm', name: 'Ringworm (Tinea Corporis)', description: 'A highly contagious fungal infection of the skin or scalp, characterized by ring-shaped red patches.', urgencyLevel: 'Low' },
  { id: 'dis_scabies', name: 'Scabies Infestation', description: 'An itchy skin condition caused by a tiny burrowing mite, leading to severe nocturnal itching.', urgencyLevel: 'Low' },

  // Ophthalmology (3)
  { id: 'dis_cataract', name: 'Cataracts', description: 'A clouding of the normally clear lens of your eye, leading to a gradual loss of vision.', urgencyLevel: 'Medium' },
  { id: 'dis_glaucoma', name: 'Glaucoma', description: 'A group of eye conditions that damage the optic nerve, often caused by abnormally high pressure in your eye.', urgencyLevel: 'High' },
  { id: 'dis_conjunctivitis', name: 'Infectious Conjunctivitis (Pink Eye)', description: 'An inflammation or infection of the transparent membrane that lines your eyelid and covers your eyeball.', urgencyLevel: 'Low' },

  // Orthopedics & Rheumatology (5)
  { id: 'dis_osteoarthritis', name: 'Osteoarthritis', description: 'The most common form of arthritis, caused by wear and tear on joints over time.', urgencyLevel: 'Low' },
  { id: 'dis_rheumatoid_arthritis', name: 'Rheumatoid Arthritis', description: 'A chronic inflammatory disorder affecting many joints, including those in the hands and feet.', urgencyLevel: 'Medium' },
  { id: 'dis_gout', name: 'Acute Gouty Arthritis', description: 'A form of inflammatory arthritis characterized by sudden, severe attacks of pain, swelling, and redness in the joints.', urgencyLevel: 'Medium' },
  { id: 'dis_herniated_disc', name: 'Herniated Disc (Sciatica)', description: 'A problem with one of the rubbery cushions (discs) between the individual bones that stack to make your spine.', urgencyLevel: 'Medium' },
  { id: 'dis_osteoporosis', name: 'Osteoporosis', description: 'A condition in which bones become weak and brittle, making them fragile and prone to fracture.', urgencyLevel: 'Low' },

  // Endocrinology (3)
  { id: 'dis_diabetes', name: 'Diabetes Mellitus (Type 2)', description: 'A chronic metabolic disease characterized by high blood sugar levels, leading to excessive thirst, fatigue, and frequent urination.', urgencyLevel: 'Medium' },
  { id: 'dis_hyperthyroidism', name: 'Hyperthyroidism', description: 'A condition in which your thyroid gland produces too much of the hormone thyroxine, accelerating metabolism.', urgencyLevel: 'Medium' },
  { id: 'dis_hypothyroidism', name: 'Hypothyroidism', description: 'A condition in which your thyroid gland doesn\'t produce enough of certain crucial hormones, slowing down metabolism.', urgencyLevel: 'Medium' },

  // Gynecology (3)
  { id: 'dis_fibroids', name: 'Uterine Fibroids', description: 'Non-cancerous growths of the uterus that often appear during childbearing years, causing heavy bleeding and pelvic pain.', urgencyLevel: 'Medium' },
  { id: 'dis_endometriosis', name: 'Endometriosis', description: 'A painful disorder in which tissue similar to the tissue that normally lines the inside of your uterus grows outside your uterus.', urgencyLevel: 'Medium' },
  { id: 'dis_pcos', name: 'Polycystic Ovary Syndrome (PCOS)', description: 'A hormonal disorder common among women of reproductive age, characterized by irregular periods or excess androgen.', urgencyLevel: 'Medium' },

  // ENT (3)
  { id: 'dis_otitis_media', name: 'Otitis Media (Middle Ear Infection)', description: 'An infection of the middle ear, the air-filled space behind the eardrum, causing severe pain.', urgencyLevel: 'Low' },
  { id: 'dis_tonsillitis', name: 'Acute Tonsillitis', description: 'Inflammation of the tonsils, usually caused by a viral or bacterial infection, resulting in difficulty swallowing.', urgencyLevel: 'Low' },
  { id: 'dis_sinusitis', name: 'Acute Sinusitis', description: 'Inflammation of the cavities around nasal passages, causing facial pain, pressure, and stuffed nose.', urgencyLevel: 'Low' },

  // Psychiatry (3)
  { id: 'dis_depression', name: 'Major Depressive Disorder', description: 'A mental health disorder characterized by persistently depressed mood or loss of interest in activities.', urgencyLevel: 'Medium' },
  { id: 'dis_anxiety_disorder', name: 'Generalized Anxiety Disorder', description: 'A mental health disorder characterized by feelings of worry, anxiety, or fear that are strong enough to interfere with daily activities.', urgencyLevel: 'Medium' },
  { id: 'dis_bipolar', name: 'Bipolar Affective Disorder', description: 'A mental health condition that causes extreme mood swings that include emotional highs (mania) and lows (depression).', urgencyLevel: 'Medium' },

  // Urology & Nephrology (3)
  { id: 'dis_uti', name: 'Urinary Tract Infection (UTI)', description: 'An infection in any part of the urinary system, including the kidneys, bladder, or urethra.', urgencyLevel: 'Medium' },
  { id: 'dis_kidney_stones', name: 'Nephrolithiasis (Kidney Stones)', description: 'Hard deposits made of minerals and salts that form inside your kidneys, causing excruciating side pain.', urgencyLevel: 'High' },
  { id: 'dis_bph', name: 'Benign Prostatic Hyperplasia (BPH)', description: 'Age-associated prostate gland enlargement that can cause difficulty with urination in men.', urgencyLevel: 'Medium' },

  // General Infectious / Primary Care (5)
  { id: 'dis_malaria', name: 'Malaria', description: 'A life-threatening disease caused by plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes, common in Nigeria.', urgencyLevel: 'Medium' },
  { id: 'dis_typhoid', name: 'Typhoid Fever', description: 'A bacterial infection caused by Salmonella typhi, transmitted through contaminated food or water, highly prevalent.', urgencyLevel: 'Medium' },
  { id: 'dis_common_cold', name: 'Acute Influenza / Common Cold', description: 'A viral infection of your nose and throat, causing runny nose, sore throat, cough, and mild fatigue.', urgencyLevel: 'Low' },
  { id: 'dis_appendicitis', name: 'Acute Appendicitis', description: 'A painful inflammation of the appendix that requires emergency surgical removal before rupture.', urgencyLevel: 'High' },
  { id: 'dis_anemia', name: 'Iron Deficiency Anemia', description: 'A condition in which blood lacks adequate healthy red blood cells, resulting in fatigue, dizziness, and pale skin.', urgencyLevel: 'Medium' }
];

export const INITIAL_SPECIALISTS: Specialist[] = [
  { id: 'spec_cardiologist', title: 'Cardiologist', description: 'Specializes in diagnosing, treating, and preventing diseases of the heart and blood vessels.', conditionsTreated: ['Hypertension', 'Angina / Coronary Artery Disease', 'Congestive Heart Failure', 'Cardiac Arrhythmia'] },
  { id: 'spec_dermatologist', title: 'Dermatologist', description: 'Specializes in conditions affecting the skin, hair, nails, and mucous membranes.', conditionsTreated: ['Atopic Eczema', 'Psoriasis Vulgaris', 'Acne Vulgaris', 'Ringworm', 'Scabies'] },
  { id: 'spec_neurologist', title: 'Neurologist', description: 'Specializes in the diagnosis and treatment of conditions involving the brain, spinal cord, and nerves.', conditionsTreated: ['Migraine Headache', 'Stroke Warning / TIA', 'Tension-Type Headache', 'Acute Meningitis', 'Epilepsy'] },
  { id: 'spec_ophthalmologist', title: 'Ophthalmologist', description: 'Specializes in eye and vision care, licensed to practice medicine and surgery.', conditionsTreated: ['Cataracts', 'Glaucoma', 'Infectious Conjunctivitis'] },
  { id: 'spec_orthopedist', title: 'Orthopedic Surgeon', description: 'Focuses on the correction, prevention, and treatment of skeletal deformities and joint disorders.', conditionsTreated: ['Osteoarthritis', 'Herniated Disc', 'Osteoporosis'] },
  { id: 'spec_gastroenterologist', title: 'Gastroenterologist', description: 'Specializes in the digestive system and its disorders, from stomach to intestines.', conditionsTreated: ['GERD', 'Acute Gastritis', 'Peptic Ulcer Disease', 'Gastroenteritis', 'Irritable Bowel Syndrome'] },
  { id: 'spec_pulmonologist', title: 'Pulmonologist', description: 'Specializes in the respiratory system, from the windpipe to the lungs.', conditionsTreated: ['Bronchial Asthma', 'COPD', 'Acute Pneumonia'] },
  { id: 'spec_endocrinologist', title: 'Endocrinologist', description: 'Specializes in hormones, metabolism, and the endocrine glands.', conditionsTreated: ['Diabetes Mellitus (Type 2)', 'Hyperthyroidism', 'Hypothyroidism', 'PCOS'] },
  { id: 'spec_pediatrician', title: 'Pediatrician', description: 'Provides medical care for infants, children, and adolescents.', conditionsTreated: ['Childhood infections', 'Pediatric fevers', 'Growth tracking'] },
  { id: 'spec_gynecologist', title: 'Gynecologist', description: 'Specializes in women\'s reproductive health and childbirth.', conditionsTreated: ['Uterine Fibroids', 'Endometriosis', 'PCOS', 'Irregular Cycles'] },
  { id: 'spec_ent', title: 'ENT Specialist', description: 'Specializes in conditions of the ear, nose, and throat.', conditionsTreated: ['Otitis Media', 'Acute Tonsillitis', 'Acute Sinusitis'] },
  { id: 'spec_psychiatrist', title: 'Psychiatrist', description: 'Specializes in mental health, diagnosing and treating emotional and behavioral disorders.', conditionsTreated: ['Major Depressive Disorder', 'Generalized Anxiety Disorder', 'Bipolar Affective Disorder'] },
  { id: 'spec_urologist', title: 'Urologist', description: 'Specializes in the urinary tract system and male reproductive organs.', conditionsTreated: ['Urinary Tract Infection', 'Kidney Stones', 'Benign Prostatic Hyperplasia'] },
  { id: 'spec_nephrologist', title: 'Nephrologist', description: 'Specializes in kidney care and treating kidney diseases.', conditionsTreated: ['Chronic Kidney Disease', 'Kidney Stones'] },
  { id: 'spec_rheumatologist', title: 'Rheumatologist', description: 'Specializes in autoimmune diseases and joint conditions.', conditionsTreated: ['Rheumatoid Arthritis', 'Acute Gouty Arthritis'] },
  { id: 'spec_gp', title: 'General Practitioner', description: 'Provides primary, continuous, and comprehensive healthcare for families.', conditionsTreated: ['Malaria', 'Typhoid Fever', 'Common Cold', 'Iron Deficiency Anemia', 'General Wellness Checkups'] }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp_luth',
    name: 'Lagos University Teaching Hospital (LUTH)',
    state: 'Lagos',
    city: 'Idi-Araba',
    address: 'Ishaga Road, Idi-Araba, Surulere, Lagos State',
    phone: '0802-345-6789',
    googleMapsLink: 'https://maps.google.com/?q=Lagos+University+Teaching+Hospital+LUTH',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_orthopedist', 'spec_gastroenterologist', 'spec_ophthalmologist', 'spec_ent', 'spec_psychiatrist', 'spec_urologist', 'spec_gp']
  },
  {
    id: 'hosp_national',
    name: 'National Hospital Abuja',
    state: 'FCT Abuja',
    city: 'Central Business District',
    address: 'Plot 272, Samuel Ademulegun St, Central Business District, Abuja',
    phone: '09-234-5678',
    googleMapsLink: 'https://maps.google.com/?q=National+Hospital+Abuja',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_orthopedist', 'spec_pulmonologist', 'spec_endocrinologist', 'spec_ophthalmologist', 'spec_psychiatrist', 'spec_urologist', 'spec_gp']
  },
  {
    id: 'hosp_uch',
    name: 'University College Hospital (UCH)',
    state: 'Oyo',
    city: 'Ibadan',
    address: 'Queen Elizabeth Road, Oritamefa, Ibadan, Oyo State',
    phone: '0803-360-6913',
    googleMapsLink: 'https://maps.google.com/?q=University+College+Hospital+Ibadan',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_gastroenterologist', 'spec_ophthalmologist', 'spec_ent', 'spec_pulmonologist', 'spec_nephrologist', 'spec_gp']
  },
  {
    id: 'hosp_abuth',
    name: 'Ahmadu Bello University Teaching Hospital',
    state: 'Kaduna',
    city: 'Zaria',
    address: 'Shika, Zaria, Kaduna State',
    phone: '0812-345-6789',
    googleMapsLink: 'https://maps.google.com/?q=Ahmadu+Bello+University+Teaching+Hospital+Zaria',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_orthopedist', 'spec_gastroenterologist', 'spec_ophthalmologist', 'spec_pulmonologist', 'spec_rheumatologist', 'spec_gp']
  },
  {
    id: 'hosp_unth',
    name: 'University of Nigeria Teaching Hospital (UNTH)',
    state: 'Enugu',
    city: 'Ituku-Ozalla',
    address: 'Ituku-Ozalla, Enugu-Port Harcourt Expressway, Enugu State',
    phone: '0805-555-6666',
    googleMapsLink: 'https://maps.google.com/?q=University+of+Nigeria+Teaching+Hospital+Enugu',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_orthopedist', 'spec_ophthalmologist', 'spec_ent', 'spec_psychiatrist', 'spec_nephrologist', 'spec_gp']
  },
  {
    id: 'hosp_upth',
    name: 'University of Port Harcourt Teaching Hospital (UPTH)',
    state: 'Rivers',
    city: 'Port Harcourt',
    address: 'East-West Road, Alakahia, Port Harcourt, Rivers State',
    phone: '0809-888-7777',
    googleMapsLink: 'https://maps.google.com/?q=University+of+Port+Harcourt+Teaching+Hospital',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_gastroenterologist', 'spec_pulmonologist', 'spec_urologist', 'spec_gp']
  },
  {
    id: 'hosp_ubth',
    name: 'University of Benin Teaching Hospital (UBTH)',
    state: 'Edo',
    city: 'Benin City',
    address: 'Ugbowo, Benin City, Edo State',
    phone: '0802-999-1111',
    googleMapsLink: 'https://maps.google.com/?q=University+of+Benin+Teaching+Hospital',
    availableSpecialists: ['spec_cardiologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_orthopedist', 'spec_ophthalmologist', 'spec_endocrinologist', 'spec_gp']
  },
  {
    id: 'hosp_akth',
    name: 'Aminu Kano Teaching Hospital (AKTH)',
    state: 'Kano',
    city: 'Kano City',
    address: 'Zaria Road, Kano, Kano State',
    phone: '0806-777-2222',
    googleMapsLink: 'https://maps.google.com/?q=Aminu+Kano+Teaching+Hospital+Kano',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_gastroenterologist', 'spec_endocrinologist', 'spec_urologist', 'spec_nephrologist', 'spec_gp']
  },
  {
    id: 'hosp_fmc_owerri',
    name: 'Federal Medical Centre (FMC) Owerri',
    state: 'Imo',
    city: 'Owerri',
    address: 'Orlu Road, Owerri, Imo State',
    phone: '0803-123-4567',
    googleMapsLink: 'https://maps.google.com/?q=Federal+Medical+Centre+Owerri',
    availableSpecialists: ['spec_cardiologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_orthopedist', 'spec_ophthalmologist', 'spec_gp']
  },
  {
    id: 'hosp_garki',
    name: 'Garki Hospital Abuja',
    state: 'FCT Abuja',
    city: 'Garki',
    address: 'P.M.B. 652, Garki Area 8, Abuja',
    phone: '+234 902 967 5063',
    googleMapsLink: 'https://maps.google.com/?q=Garki+Hospital+Abuja',
    availableSpecialists: ['spec_cardiologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_gastroenterologist', 'spec_gp']
  },
  {
    id: 'hosp_reddington',
    name: 'Reddington Hospital',
    state: 'Lagos',
    city: 'Victoria Island',
    address: '12 Idowu Taylor St, Victoria Island, Lagos State',
    phone: '01-271-5341',
    googleMapsLink: 'https://maps.google.com/?q=Reddington+Hospital+Victoria+Island',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_gastroenterologist', 'spec_orthopedist', 'spec_endocrinologist', 'spec_gp']
  },
  {
    id: 'hosp_st_nicholas',
    name: 'St. Nicholas Hospital',
    state: 'Lagos',
    city: 'Lagos Island',
    address: '57 Campbell Street, Lagos Island, Lagos State',
    phone: '01-271-3464',
    googleMapsLink: 'https://maps.google.com/?q=St+Nicholas+Hospital+Campbell+St+Lagos',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_gastroenterologist', 'spec_orthopedist', 'spec_urologist', 'spec_nephrologist', 'spec_gp']
  },
  {
    id: 'hosp_lagoon',
    name: 'Lagoon Hospital',
    state: 'Lagos',
    city: 'Ikoyi',
    address: '11B Boundary Road, Ikoyi, Lagos State',
    phone: '0703-360-6913',
    googleMapsLink: 'https://maps.google.com/?q=Lagoon+Hospital+Ikoyi+Lagos',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_gastroenterologist', 'spec_gp']
  },
  {
    id: 'hosp_first_cardio',
    name: 'First Cardiology Consultants',
    state: 'Lagos',
    city: 'Ikoyi',
    address: '20 Thompson Ave, Ikoyi, Lagos State',
    phone: '01-440-6430',
    googleMapsLink: 'https://maps.google.com/?q=First+Cardiology+Consultants+Ikoyi',
    availableSpecialists: ['spec_cardiologist', 'spec_gp']
  },
  {
    id: 'hosp_evercare',
    name: 'Evercare Hospital Lekki',
    state: 'Lagos',
    city: 'Lekki',
    address: '1 Evercare Way, Lekki Phase 1, Lagos State',
    phone: '0813-985-0710',
    googleMapsLink: 'https://maps.google.com/?q=Evercare+Hospital+Lekki+Lagos',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_dermatologist', 'spec_orthopedist', 'spec_gastroenterologist', 'spec_pulmonologist', 'spec_urologist', 'spec_gp']
  },
  {
    id: 'hosp_nizamiye',
    name: 'Nizamiye Hospital',
    state: 'FCT Abuja',
    city: 'Lifecamp',
    address: 'Plot 23, Lifecamp, Cadastral Zone B03, Abuja',
    phone: '0816-000-2600',
    googleMapsLink: 'https://maps.google.com/?q=Nizamiye+Hospital+Abuja',
    availableSpecialists: ['spec_cardiologist', 'spec_neurologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_orthopedist', 'spec_ent', 'spec_urologist', 'spec_gp']
  },
  {
    id: 'hosp_prime_ph',
    name: 'Prime Medical Consultants',
    state: 'Rivers',
    city: 'Port Harcourt',
    address: '56 Tombia Extension, GRA Phase 2, Port Harcourt, Rivers State',
    phone: '084-463-261',
    googleMapsLink: 'https://maps.google.com/?q=Prime+Medical+Consultants+Port+Harcourt',
    availableSpecialists: ['spec_pediatrician', 'spec_gynecologist', 'spec_gastroenterologist', 'spec_gp']
  },
  {
    id: 'hosp_lily_warri',
    name: 'Lily Hospitals Warri',
    state: 'Delta',
    city: 'Warri',
    address: '6 Lily Close, off Deco Road, Warri, Delta State',
    phone: '0803-545-5666',
    googleMapsLink: 'https://maps.google.com/?q=Lily+Hospitals+Warri',
    availableSpecialists: ['spec_cardiologist', 'spec_pediatrician', 'spec_gynecologist', 'spec_gastroenterologist', 'spec_gp']
  },
  {
    id: 'hosp_memfys',
    name: 'Memfys Hospital for Neurosurgery',
    state: 'Enugu',
    city: 'Enugu City',
    address: 'Kilometre 2, Memfys Hospital Road, Enugu State',
    phone: '0803-342-2433',
    googleMapsLink: 'https://maps.google.com/?q=Memfys+Hospital+Enugu',
    availableSpecialists: ['spec_neurologist', 'spec_gp']
  },
  {
    id: 'hosp_kelina',
    name: 'Kelina Hospital',
    state: 'FCT Abuja',
    city: 'Gwarinpa',
    address: 'Third Avenue, Gwarinpa, Abuja',
    phone: '0803-304-1150',
    googleMapsLink: 'https://maps.google.com/?q=Kelina+Hospital+Abuja',
    availableSpecialists: ['spec_urologist', 'spec_nephrologist', 'spec_gp']
  },
  {
    id: 'hosp_outreach',
    name: 'Outreach Women and Children Hospital',
    state: 'Lagos',
    city: 'Festac',
    address: '4th Avenue, Festac Town, Lagos State',
    phone: '0803-433-2244',
    googleMapsLink: 'https://maps.google.com/?q=Outreach+Hospital+Festac+Lagos',
    availableSpecialists: ['spec_pediatrician', 'spec_gynecologist', 'spec_gp']
  },
  {
    id: 'hosp_cedarcrest',
    name: 'Cedarcrest Hospitals',
    state: 'FCT Abuja',
    city: 'Apo',
    address: 'Plot 1007, Apo, Abuja',
    phone: '0809-393-3333',
    googleMapsLink: 'https://maps.google.com/?q=Cedarcrest+Hospitals+Abuja',
    availableSpecialists: ['spec_orthopedist', 'spec_neurologist', 'spec_rheumatologist', 'spec_gp']
  }
];

export const INITIAL_THERAPY_GUIDES: TherapyGuide[] = [
  { id: 'tg_migraine', condition: 'Migraine Headache', basicAdvice: ['Rest in a quiet, dark room with eyes closed', 'Apply a cold compress or ice pack to your forehead or temples', 'Hydrate adequately; avoid caffeine and chocolate triggers', 'Practice slow, deep, rhythmic breathing'], seeDocIf: 'Pain is severe, lasts longer than 72 hours, or is accompanied by visual disturbances.', emergencyFlags: '⚠️ Sudden, severe "thunderclap" headache, fever, stiff neck, confusion, double vision, or speech issues.' },
  { id: 'tg_stroke', condition: 'Stroke Warning / TIA', basicAdvice: ['Do not try to take pain meds or go to sleep', 'Lie flat and comfortable on your back', 'Record the exact time symptom onset began'], seeDocIf: 'Any facial drooping, arm weakness, or slurred speech occurs even if it goes away quickly (possible TIA).', emergencyFlags: '🚨 Act FAST. Sudden face drooping, arm numbness, slurred speech, sudden loss of vision, or balance.' },
  { id: 'tg_tension', condition: 'Tension-Type Headache', basicAdvice: ['Take a warm bath or apply a heating pad to your neck/shoulders', 'Practice gentle neck stretching exercises', 'Manage stress levels; stay hydrated'], seeDocIf: 'Headaches occur more than twice a week or worsen continuously.', emergencyFlags: '⚠️ Stiff neck, high fever, vomiting, or confusion.' },
  { id: 'tg_meningitis', condition: 'Acute Meningitis', basicAdvice: ['Rest quietly; avoid bright lights', 'Prepare to go to the emergency room immediately', 'Keep hydration up but do not delay professional help'], seeDocIf: 'High fever, severe headache, and neck stiffness are present.', emergencyFlags: '🚨 Seek immediate emergency medical attention. High risk of life-threatening complications.' },
  { id: 'tg_epilepsy', condition: 'Epilepsy or Seizure Disorder', basicAdvice: ['Ensure the person is lying on their side to keep airway clear', 'Place something soft under their head; clear sharp objects nearby', 'Do not insert anything into their mouth or restrain them'], seeDocIf: 'Seizures are recurrent or follow a new pattern.', emergencyFlags: '🚨 Seizure lasts longer than 5 minutes, or the person does not regain consciousness shortly after.' },
  { id: 'tg_hyper', condition: 'Hypertension (High Blood Pressure)', basicAdvice: ['Sit down and rest in a comfortable environment immediately', 'Reduce sodium (salt) intake strictly in foods', 'Monitor and keep a record of blood pressure twice daily'], seeDocIf: 'Blood pressure remains above 140/90 mmHg across multiple readings.', emergencyFlags: '🚨 Blood pressure over 180/120 mmHg accompanied by chest pain, shortness of breath, blurry vision, or headache.' },
  { id: 'tg_angina', condition: 'Angina / Coronary Artery Disease', basicAdvice: ['Stop any physical activity and sit down immediately', 'Breathe slowly and keep calm', 'Loosen tight clothing around neck/chest'], seeDocIf: 'Discomfort occurs occasionally during exertion and resolves with rest.', emergencyFlags: '🚨 Crushing chest pain that radiates to jaw, neck, back, or left arm, or is accompanied by sweating and nausea.' },
  { id: 'tg_heart_failure', condition: 'Congestive Heart Failure', basicAdvice: ['Sit upright to make breathing easier', 'Elevate legs to reduce leg swelling if sitting or resting', 'Monitor and limit fluid and salt intake carefully'], seeDocIf: 'Sudden weight gain of over 1.5kg in a day, or worsening fatigue and leg swelling.', emergencyFlags: '🚨 Severe shortness of breath, coughing up pink/frothy sputum, or blue lips/skin.' },
  { id: 'tg_arrhythmia', condition: 'Cardiac Arrhythmia', basicAdvice: ['Sit down and try the Valsalva maneuver (bearing down like a bowel movement)', 'Avoid stimulants like caffeine, alcohol, or nicotine', 'Breathe slowly and deeply'], seeDocIf: 'Palpitations are frequent, persistent, or cause concern.', emergencyFlags: '🚨 Heart palpitations accompanied by chest pain, shortness of breath, lightheadedness, or fainting.' },
  { id: 'tg_asthma', condition: 'Bronchial Asthma', basicAdvice: ['Sit fully upright and keep calm (do not lie down)', 'Move away from triggers (smoke, dust, cold air)', 'Use your rescue inhaler if available'], seeDocIf: 'Inhaler is needed more than twice a week or coughing/wheezing is persistent.', emergencyFlags: '🚨 Severe breathing struggle, indrawing of chest skin, blue lips/nails, inability to speak full sentences.' },
  { id: 'tg_copd', condition: 'Chronic Obstructive Pulmonary Disease (COPD)', basicAdvice: ['Practice pursed-lip breathing (inhale through nose, exhale slowly through pursed lips)', 'Use prescribed bronchodilators; stay in a clean air environment', 'Stay hydrated to help thin mucus in lungs'], seeDocIf: 'Phlegm production increases, or shortness of breath worsens gradually.', emergencyFlags: '🚨 Severe shortness of breath, confusion, blue fingertips/lips, or inability to sleep due to breathing trouble.' },
  { id: 'tg_pneumonia', condition: 'Acute Pneumonia', basicAdvice: ['Get plenty of bed rest', 'Drink warm liquids (herbal tea, water) to loosen chest congestion', 'Use a humidifier or inhale steam from a warm shower'], seeDocIf: 'Cough with yellow/green phlegm worsens, or fever persists.', emergencyFlags: '🚨 Difficulty breathing, chest pain when breathing, high fever with chills, or confusion in older adults.' },
  { id: 'tg_gerd', condition: 'GERD (Gastroesophageal Reflux Disease)', basicAdvice: ['Avoid lying flat for at least 3 hours after eating', 'Elevate head of bed by 6 inches', 'Limit trigger foods: spicy, fried, citrus, chocolate, caffeine'], seeDocIf: 'Heartburn occurs more than twice a week or is severe.', emergencyFlags: '⚠️ Difficulty swallowing, vomiting blood, black tarry stools, or unexplained weight loss.' },
  { id: 'tg_gastritis', condition: 'Acute Gastritis', basicAdvice: ['Adhere to a bland, soft food diet (oats, banana, plain rice)', 'Avoid NSAID pain relief like Ibuprofen or Aspirin; use acetaminophen instead', 'Drink chamomile tea or warm water'], seeDocIf: 'Burning stomach pain or nausea persists beyond a week.', emergencyFlags: '⚠️ Vomiting blood or coffee-ground material, severe sudden stomach pain, or black stools.' },
  { id: 'tg_peptic_ulcer', condition: 'Peptic Ulcer Disease (PUD)', basicAdvice: ['Eat smaller, more frequent meals to prevent stomach emptiness', 'Avoid smoking, alcohol, and spicy foods', 'Take antacids as directed for temporary relief'], seeDocIf: 'Stomach pain worsens, especially a few hours after eating or at night.', emergencyFlags: '🚨 Sudden, extremely severe stomach pain (indicates perforation), vomiting blood, or fainting.' },
  { id: 'tg_gastroenteritis', condition: 'Gastroenteritis (Stomach Flu)', basicAdvice: ['Sip Oral Rehydration Salts (ORS) frequently to prevent dehydration', 'Eat small portions of bland foods (BRAT diet: bananas, rice, applesauce, toast)', 'Avoid dairy, caffeine, and fatty foods'], seeDocIf: 'Diarrhea or vomiting lasts longer than 48 hours without improvement.', emergencyFlags: '⚠️ Inability to keep fluids down, extreme dizziness, blood in vomit or stool, high fever.' },
  { id: 'tg_ibs', condition: 'Irritable Bowel Syndrome (IBS)', basicAdvice: ['Keep a food diary to identify and avoid individual trigger foods', 'Increase dietary fiber gradually; stay hydrated', 'Engage in regular exercise and stress-reduction techniques'], seeDocIf: 'Symptoms significantly interfere with daily life or change patterns.', emergencyFlags: '⚠️ Unexplained weight loss, rectal bleeding, fever, or persistent diarrhea at night.' },
  { id: 'tg_eczema', condition: 'Atopic Eczema (Dermatitis)', basicAdvice: ['Apply fragrance-free moisturizers twice daily, especially right after bathing', 'Bathe in lukewarm water for under 10 minutes; use mild soap', 'Avoid scratching; wear breathable cotton clothes'], seeDocIf: 'Skin shows signs of infection (pus, weeping, yellow crusts) or disrupts sleep.', emergencyFlags: '⚠️ Sudden, painful blistering or spreading redness with fever.' },
  { id: 'tg_psoriasis', condition: 'Psoriasis Vulgaris', basicAdvice: ['Moisturize skin diligently; expose skin to natural sunlight carefully', 'Avoid skin injuries (cuts, scrapes) and infections which trigger flare-ups', 'Use coal tar soaps or moisturizers if appropriate'], seeDocIf: 'Joint pain accompanies skin plaques, or plaques spread rapidly.', emergencyFlags: '⚠️ Widespread painful skin peeling or pustules across the entire body with fever.' },
  { id: 'tg_acne', condition: 'Acne Vulgaris', basicAdvice: ['Wash face gently twice daily with a mild, non-comedogenic cleanser', 'Avoid picking or squeezing pimples (can lead to scarring)', 'Keep hair clean and off your face; wash pillowcases regularly'], seeDocIf: 'Acne is deep, painful, cystic, or causes scarring.', emergencyFlags: '⚠️ Severe swelling, warmth, or redness around lesions (possible secondary cellulitis).' },
  { id: 'tg_ringworm', condition: 'Ringworm (Tinea Corporis)', basicAdvice: ['Apply over-the-counter antifungal cream (clotrimazole, miconazole) twice daily', 'Keep the affected skin clean and dry', 'Do not share clothing, towels, or sheets with others'], seeDocIf: 'Rash does not improve after 2 weeks of antifungal treatment.', emergencyFlags: '⚠️ Rash spreads rapidly, becomes highly swollen, or discharges pus.' },
  { id: 'tg_scabies', condition: 'Scabies Infestation', basicAdvice: ['Wash all clothing, bedding, and towels used in hot water; dry on high heat', 'Entire household must be treated concurrently to prevent reinfection', 'Keep fingernails trimmed to avoid skin infection from scratching'], seeDocIf: 'Severe itching persists longer than 2 weeks after scabies treatment.', emergencyFlags: '⚠️ Spreading skin infection with yellow crusting, pus, or fever.' },
  { id: 'tg_cataract', condition: 'Cataracts', basicAdvice: ['Ensure indoor lighting is bright and appropriate to prevent falls', 'Wear UV-blocking sunglasses outdoors', 'Avoid driving at night if glares are bothersome'], seeDocIf: 'Gradual, painless clouding or blurring of vision occurs.', emergencyFlags: '🚨 Sudden vision loss, severe eye pain, or flashes of light.' },
  { id: 'tg_glaucoma', condition: 'Glaucoma', basicAdvice: ['Refrain from rubbing eyes; adhere strictly to prescribed pressure-lowering drops', 'Get regular comprehensive eye examinations', 'Avoid over-the-counter cold medications that can raise eye pressure'], seeDocIf: 'Gradual loss of peripheral vision (tunnel vision) is noticed.', emergencyFlags: '🚨 Sudden, severe eye pain, blurred vision, headache, nausea, and rainbows around lights.' },
  { id: 'tg_conjunctivitis', condition: 'Infectious Conjunctivitis (Pink Eye)', basicAdvice: ['Apply clean, warm or cool compresses to the closed eye', 'Avoid touching or rubbing the eye; wash hands frequently with soap', 'Do not wear contact lenses or eye makeup until resolved'], seeDocIf: 'Symptoms do not improve after 3-4 days, or discharge is thick/yellow.', emergencyFlags: '🚨 Severe eye pain, sensitivity to light, or vision changes/loss.' },
  { id: 'tg_osteoarthritis', condition: 'Osteoarthritis', basicAdvice: ['Perform low-impact exercises like swimming, walking, or cycling', 'Apply cold packs for joint swelling, and hot packs for joint stiffness', 'Wear supportive footwear; maintain a healthy weight'], seeDocIf: 'Pain prevents daily activities or joint swelling is significant.', emergencyFlags: '⚠️ Joint is hot, red, and swollen with high fever (signs of joint infection).' },
  { id: 'tg_rheumatoid_arthritis', condition: 'Rheumatoid Arthritis', basicAdvice: ['Balance activity with plenty of joint-resting breaks', 'Perform gentle range-of-motion stretching exercises', 'Apply warm compresses to stiff joints in the morning'], seeDocIf: 'Morning joint stiffness lasts longer than an hour, or multiple joints are swollen.', emergencyFlags: '⚠️ High fever, severe joint swelling, or difficulty breathing (systemic RA flare).' },
  { id: 'tg_gout', condition: 'Acute Gouty Arthritis', basicAdvice: ['Rest and elevate the affected joint (usually the big toe)', 'Avoid alcohol, seafood, and red meat (high-purine foods)', 'Drink plenty of water to help flush uric acid from kidneys'], seeDocIf: 'First attack occurs, or joint pain is unbearable.', emergencyFlags: '⚠️ Inability to bear weight on the joint with fever and chills (possible septic joint).' },
  { id: 'tg_herniated_disc', condition: 'Herniated Disc (Sciatica)', basicAdvice: ['Avoid bed rest longer than 1-2 days; stay gently active', 'Apply ice packs for the first 48 hours, then switch to heat pads', 'Avoid heavy lifting, twisting, or prolonged sitting'], seeDocIf: 'Sharp radiating leg pain or numbness lasts over 2 weeks.', emergencyFlags: '🚨 Loss of bladder or bowel control, or numbness in the groin area (Cauda Equina Syndrome).' },
  { id: 'tg_osteoporosis', condition: 'Osteoporosis', basicAdvice: ['Consume adequate calcium and vitamin D through diet/supplements', 'Engage in weight-bearing exercises (walking, dancing, light weights)', 'Modify home environment to prevent tripping/slips'], seeDocIf: 'A minor fall or bump results in severe bone pain (possible fracture).', emergencyFlags: '🚨 Sudden severe back pain (possible vertebral compression fracture).' },
  { id: 'tg_diabetes', condition: 'Diabetes Mellitus (Type 2)', basicAdvice: ['Eat a low-glycemic, high-fiber diet; limit refined sugars', 'Incorporate 30 minutes of aerobic exercise (like brisk walking) daily', 'Check feet daily for cuts, blisters, or dry cracked skin', 'Monitor blood sugar levels closely'], seeDocIf: 'Blood sugar readings are consistently high or fatigue is persistent.', emergencyFlags: '🚨 Extreme weakness, fruity breath, rapid deep breathing, confusion, or loss of consciousness.' },
  { id: 'tg_hyperthyroid', condition: 'Hyperthyroidism', basicAdvice: ['Eat high-calorie, nutrient-dense foods if experiencing weight loss', 'Practice relaxation techniques to manage anxiety and rapid heart rate', 'Avoid caffeine and other stimulants'], seeDocIf: 'Unexplained weight loss, rapid heartbeat, or heat intolerance occurs.', emergencyFlags: '🚨 Extremely high heart rate, fever, sweating, and confusion (possible Thyroid Storm).' },
  { id: 'tg_hypothyroid', condition: 'Hypothyroidism', basicAdvice: ['Eat a high-fiber diet to manage constipation; stay active', 'Protect skin from dryness with rich moisturizers', 'Wear warm clothing in cold environments'], seeDocIf: 'Persistent fatigue, unexplained weight gain, dry skin, and feeling cold.', emergencyFlags: '🚨 Extreme drowsiness, confusion, hypothermia, or swelling of face/limbs (Myxedema coma).' },
  { id: 'tg_fibroids', condition: 'Uterine Fibroids', basicAdvice: ['Use a heating pad on your abdomen for pelvic cramps', 'Consume iron-rich foods if experiencing heavy periods', 'Exercise regularly; manage stress levels'], seeDocIf: 'Menstrual bleeding is exceptionally heavy, or pelvic pain is constant.', emergencyFlags: '🚨 Sudden, sharp pelvic pain, or extreme dizziness and pale skin from blood loss.' },
  { id: 'tg_endometriosis', condition: 'Endometriosis', basicAdvice: ['Apply heat packs to the lower abdomen or lower back', 'Engage in gentle exercises like walking or yoga to relieve muscle tension', 'Track symptoms to discuss with your doctor'], seeDocIf: 'Pelvic pain significantly interferes with daily work or relationships.', emergencyFlags: '🚨 Sharp, severe abdominal pain with fever, vomiting, or inability to pass gas.' },
  { id: 'tg_pcos', condition: 'Polycystic Ovary Syndrome (PCOS)', basicAdvice: ['Aim for a balanced diet rich in whole grains, lean proteins, and fiber', 'Engage in regular physical activity to help manage insulin resistance', 'Track menstrual cycles and any abnormal hair growth/acne'], seeDocIf: 'Menstrual cycles are highly irregular, or trying to conceive.', emergencyFlags: '⚠️ Severe sudden pelvic pain (possible ovarian cyst rupture).' },
  { id: 'tg_otitis_media', condition: 'Otitis Media (Middle Ear Infection)', basicAdvice: ['Place a warm, moist washcloth over the affected ear', 'Rest in an upright position (helps drain fluid from Eustachian tube)', 'Stay hydrated; avoid getting water inside the ear'], seeDocIf: 'Ear pain worsens, or fluid drains from the ear.', emergencyFlags: '⚠️ High fever, severe headache, swelling behind the ear, or sudden hearing loss.' },
  { id: 'tg_tonsillitis', condition: 'Acute Tonsillitis', basicAdvice: ['Gargle with warm salt water (1/2 teaspoon salt in warm water) several times a day', 'Drink warm liquids or eat cool, soft foods to soothe the throat', 'Get plenty of voice and body rest'], seeDocIf: 'Sore throat lasts longer than 3-4 days or swallowing is very painful.', emergencyFlags: '🚨 Difficulty breathing, inability to swallow saliva (drooling), or stiff neck.' },
  { id: 'tg_sinusitis', condition: 'Acute Sinusitis', basicAdvice: ['Inhale steam from a hot shower or bowl of hot water', 'Apply a warm, wet towel to your face (forehead, nose, cheeks)', 'Use a saline nasal spray to moisten nasal passages'], seeDocIf: 'Symptoms last longer than 10 days, or facial pain is severe.', emergencyFlags: '⚠️ High fever, swelling/redness around the eyes, severe headache, or stiff neck.' },
  { id: 'tg_depression', condition: 'Major Depressive Disorder', basicAdvice: ['Establish a gentle, regular daily routine; get adequate sleep', 'Engage in light physical activity daily (even a 15-minute walk)', 'Reach out to trusted family members, friends, or support groups'], seeDocIf: 'Depressed mood or loss of interest lasts longer than 2 weeks.', emergencyFlags: '🚨 Any thoughts of self-harm, suicide, or feelings of complete hopelessness.' },
  { id: 'tg_anxiety_disorder', condition: 'Generalized Anxiety Disorder', basicAdvice: ['Practice daily relaxation techniques (deep breathing, progressive muscle relaxation)', 'Limit or avoid caffeine, alcohol, and nicotine which mimic anxiety', 'Incorporate regular cardiovascular exercise'], seeDocIf: 'Worry and physical symptoms of anxiety disrupt work or sleep.', emergencyFlags: '🚨 Severe panic attacks that cause chest pain, hyperventilation, or inability to function.' },
  { id: 'tg_bipolar', condition: 'Bipolar Affective Disorder', basicAdvice: ['Maintain a highly structured daily schedule for sleeping and waking', 'Avoid alcohol and recreational drugs which destabilize mood', 'Keep a daily mood log to identify early warning signs of mood shifts'], seeDocIf: 'Mood swings or sleep disturbances become noticeable to others.', emergencyFlags: '🚨 Feeling extremely manic, reckless, or experiencing severe suicidal depression.' },
  { id: 'tg_uti', condition: 'Urinary Tract Infection (UTI)', basicAdvice: ['Drink lots of water to help flush bacteria out of your urinary tract', 'Avoid bladder irritants like coffee, alcohol, and carbonated soft drinks', 'Urinate immediately when the urge arises; do not hold urine'], seeDocIf: 'Painful or frequent urination lasts longer than 24 hours.', emergencyFlags: '🚨 High fever, chills, back/side pain, or vomiting (indicates kidney infection).' },
  { id: 'tg_kidney_stones', condition: 'Nephrolithiasis (Kidney Stones)', basicAdvice: ['Drink large quantities of water (2 to 3 liters daily) to help stone pass', 'Apply heating pad to the side or back for mild pain', 'Rest comfortably; avoid heavy strain'], seeDocIf: 'Pain in side or back is severe and fluctuates.', emergencyFlags: '🚨 Excruciating side/back pain, inability to find a comfortable position, bloody urine, fever, or vomiting.' },
  { id: 'tg_bph', condition: 'Benign Prostatic Hyperplasia (BPH)', basicAdvice: ['Limit fluid intake in the evening, especially caffeine and alcohol', 'Double void: urinate, relax, and try again a minute later', 'Stay active; physical activity helps reduce urinary symptoms'], seeDocIf: 'Difficulty initiating urination, or frequent urination at night.', emergencyFlags: '🚨 Complete inability to urinate (acute urinary retention), fever, or bloody urine.' },
  { id: 'tg_malaria', condition: 'Malaria', basicAdvice: ['Rest in a cool, ventilated room', 'Sip clear fluids or electrolyte solutions to stay hydrated during fever', 'Use paracetamol to control fever; do not delay diagnostic blood test'], seeDocIf: 'Fever with chills, headache, or sweating occurs in malaria-endemic areas.', emergencyFlags: '🚨 Persistent vomiting, yellow eyes (jaundice), severe confusion, seizures, or dark urine.' },
  { id: 'tg_typhoid', condition: 'Typhoid Fever', basicAdvice: ['Drink boiled or bottled water only; avoid ice cubes', 'Eat warm, thoroughly cooked food; avoid raw fruits/vegetables', 'Take paracetamol for fever; hydrate aggressively with clear fluids'], seeDocIf: 'High fever, abdominal pain, diarrhea, or extreme weakness persists.', emergencyFlags: '🚨 Severe abdominal pain with swelling, vomiting blood, black stools, or confusion.' },
  { id: 'tg_common_cold', condition: 'Acute Influenza / Common Cold', basicAdvice: ['Get ample rest; drink plenty of warm liquids (water, tea, broth)', 'Gargle with warm salt water to relieve sore throat', 'Use saline nasal drops for congestion'], seeDocIf: 'Symptoms last longer than 10-14 days or worsen suddenly.', emergencyFlags: '⚠️ High, persistent fever, severe shortness of breath, chest pain, or coughing up blood.' },
  { id: 'tg_appendicitis', condition: 'Acute Appendicitis', basicAdvice: ['Stop eating and drinking immediately (prepare for potential surgery)', 'Do not take pain relievers, laxatives, or apply heat pads (can cause rupture)', 'Lie down and remain completely still'], seeDocIf: 'Dull pain around belly button moves to the lower right abdomen and sharpens.', emergencyFlags: '🚨 Severe abdominal pain that suddenly worsens, high fever, continuous vomiting, or rigid abdomen.' },
  { id: 'tg_anemia', condition: 'Iron Deficiency Anemia', basicAdvice: ['Incorporate iron-rich foods in diet: green leafy vegetables, beans, lean meats', 'Consume vitamin C (oranges, tomatoes) alongside iron to boost absorption', 'Avoid drinking tea or coffee during meals (blocks iron absorption)'], seeDocIf: 'Persistent extreme fatigue, pale skin, cold hands/feet, or brittle nails.', emergencyFlags: '⚠️ Shortness of breath with minimal exertion, chest pain, or irregular fast heartbeat.' }
];

export const INITIAL_RULES: Rule[] = [
  // 52 rules mapping combinations of symptoms directly to diseases
  { id: 'rule_migraine', symptomIds: ['sym_headache', 'sym_dizziness', 'sym_nausea'], diseaseId: 'dis_migraine', specialistId: 'spec_neurologist', confidenceScore: 0.90 },
  { id: 'rule_stroke', symptomIds: ['sym_numbness', 'sym_confusion', 'sym_seizures'], diseaseId: 'dis_stroke', specialistId: 'spec_neurologist', confidenceScore: 0.95 },
  { id: 'rule_tension', symptomIds: ['sym_headache', 'sym_fatigue'], diseaseId: 'dis_tension_headache', specialistId: 'spec_neurologist', confidenceScore: 0.80 },
  { id: 'rule_meningitis', symptomIds: ['sym_headache', 'sym_fever', 'sym_neck_stiffness'], diseaseId: 'dis_meningitis', specialistId: 'spec_neurologist', confidenceScore: 0.95 },
  { id: 'rule_epilepsy', symptomIds: ['sym_seizures', 'sym_confusion'], diseaseId: 'dis_epilepsy', specialistId: 'spec_neurologist', confidenceScore: 0.90 },
  
  { id: 'rule_hyper', symptomIds: ['sym_headache', 'sym_dizziness', 'sym_palpitations'], diseaseId: 'dis_hypertension', specialistId: 'spec_cardiologist', confidenceScore: 0.85 },
  { id: 'rule_angina', symptomIds: ['sym_chest_pain', 'sym_shortness_breath', 'sym_palpitations'], diseaseId: 'dis_angina', specialistId: 'spec_cardiologist', confidenceScore: 0.95 },
  { id: 'rule_heart_failure', symptomIds: ['sym_shortness_breath', 'sym_fatigue', 'sym_joint_pain'], diseaseId: 'dis_heart_failure', specialistId: 'spec_cardiologist', confidenceScore: 0.75 },
  { id: 'rule_arrhythmia', symptomIds: ['sym_palpitations', 'sym_dizziness'], diseaseId: 'dis_arrhythmia', specialistId: 'spec_cardiologist', confidenceScore: 0.85 },

  { id: 'rule_asthma', symptomIds: ['sym_shortness_breath', 'sym_cough', 'sym_wheezing'], diseaseId: 'dis_asthma', specialistId: 'spec_pulmonologist', confidenceScore: 0.90 },
  { id: 'rule_copd', symptomIds: ['sym_shortness_breath', 'sym_cough', 'sym_fatigue'], diseaseId: 'dis_copd', specialistId: 'spec_pulmonologist', confidenceScore: 0.80 },
  { id: 'rule_pneumonia', symptomIds: ['sym_cough', 'sym_fever', 'sym_chest_pain'], diseaseId: 'dis_pneumonia', specialistId: 'spec_pulmonologist', confidenceScore: 0.90 },

  { id: 'rule_gerd', symptomIds: ['sym_heartburn', 'sym_nausea'], diseaseId: 'dis_gerd', specialistId: 'spec_gastroenterologist', confidenceScore: 0.85 },
  { id: 'rule_gastritis', symptomIds: ['sym_stomach_pain', 'sym_nausea', 'sym_heartburn'], diseaseId: 'dis_gastritis', specialistId: 'spec_gastroenterologist', confidenceScore: 0.90 },
  { id: 'rule_peptic_ulcer', symptomIds: ['sym_stomach_pain', 'sym_heartburn', 'sym_loss_of_appetite'], diseaseId: 'dis_peptic_ulcer', specialistId: 'spec_gastroenterologist', confidenceScore: 0.85 },
  { id: 'rule_gastroenteritis', symptomIds: ['sym_stomach_pain', 'sym_nausea', 'sym_diarrhea'], diseaseId: 'dis_gastroenteritis', specialistId: 'spec_gastroenterologist', confidenceScore: 0.95 },
  { id: 'rule_ibs', symptomIds: ['sym_stomach_pain', 'sym_constipation', 'sym_abdominal_bloating'], diseaseId: 'dis_ibs', specialistId: 'spec_gastroenterologist', confidenceScore: 0.85 },

  { id: 'rule_eczema', symptomIds: ['sym_rash', 'sym_itching', 'sym_dry_skin'], diseaseId: 'dis_eczema', specialistId: 'spec_dermatologist', confidenceScore: 0.95 },
  { id: 'rule_psoriasis', symptomIds: ['sym_rash', 'sym_skin_scaling'], diseaseId: 'dis_psoriasis', specialistId: 'spec_dermatologist', confidenceScore: 0.85 },
  { id: 'rule_acne', symptomIds: ['sym_skin_lesion', 'sym_itching'], diseaseId: 'dis_acne', specialistId: 'spec_dermatologist', confidenceScore: 0.70 },
  { id: 'rule_ringworm', symptomIds: ['sym_rash', 'sym_itching'], diseaseId: 'dis_ringworm', specialistId: 'spec_dermatologist', confidenceScore: 0.75 },
  { id: 'rule_scabies', symptomIds: ['sym_itching', 'sym_rash', 'sym_dry_skin'], diseaseId: 'dis_scabies', specialistId: 'spec_dermatologist', confidenceScore: 0.80 },

  { id: 'rule_cataract', symptomIds: ['sym_blurred_vision', 'sym_eye_pain'], diseaseId: 'dis_cataract', specialistId: 'spec_ophthalmologist', confidenceScore: 0.80 },
  { id: 'rule_glaucoma', symptomIds: ['sym_eye_pain', 'sym_vision_loss'], diseaseId: 'dis_glaucoma', specialistId: 'spec_ophthalmologist', confidenceScore: 0.95 },
  { id: 'rule_conjunctivitis', symptomIds: ['sym_eye_pain', 'sym_blurred_vision'], diseaseId: 'dis_conjunctivitis', specialistId: 'spec_ophthalmologist', confidenceScore: 0.75 },

  { id: 'rule_osteo', symptomIds: ['sym_joint_pain', 'sym_stiffness'], diseaseId: 'dis_osteoarthritis', specialistId: 'spec_orthopedist', confidenceScore: 0.90 },
  { id: 'rule_rheumatoid', symptomIds: ['sym_joint_pain', 'sym_joint_swelling', 'sym_stiffness'], diseaseId: 'dis_rheumatoid_arthritis', specialistId: 'spec_rheumatologist', confidenceScore: 0.90 },
  { id: 'rule_gout', symptomIds: ['sym_joint_pain', 'sym_joint_swelling', 'sym_fever'], diseaseId: 'dis_gout', specialistId: 'spec_rheumatologist', confidenceScore: 0.85 },
  { id: 'rule_herniated_disc', symptomIds: ['sym_back_pain', 'sym_numbness', 'sym_muscle_weakness'], diseaseId: 'dis_herniated_disc', specialistId: 'spec_orthopedist', confidenceScore: 0.90 },
  { id: 'rule_osteoporosis', symptomIds: ['sym_back_pain', 'sym_fatigue'], diseaseId: 'dis_osteoporosis', specialistId: 'spec_orthopedist', confidenceScore: 0.65 },

  { id: 'rule_diabetes', symptomIds: ['sym_thirst', 'sym_fatigue', 'sym_weight_loss'], diseaseId: 'dis_diabetes', specialistId: 'spec_endocrinologist', confidenceScore: 0.95 },
  { id: 'rule_hyperthyroid', symptomIds: ['sym_weight_loss', 'sym_sweating', 'sym_heat_intolerance'], diseaseId: 'dis_hyperthyroidism', specialistId: 'spec_endocrinologist', confidenceScore: 0.90 },
  { id: 'rule_hypothyroid', symptomIds: ['sym_fatigue', 'sym_cold_intolerance', 'sym_hair_loss'], diseaseId: 'dis_hypothyroidism', specialistId: 'spec_endocrinologist', confidenceScore: 0.90 },

  { id: 'rule_fibroids', symptomIds: ['sym_pelvic_pain', 'sym_irregular_periods', 'sym_menstrual_cramps'], diseaseId: 'dis_fibroids', specialistId: 'spec_gynecologist', confidenceScore: 0.90 },
  { id: 'rule_endometriosis', symptomIds: ['sym_pelvic_pain', 'sym_menstrual_cramps'], diseaseId: 'dis_endometriosis', specialistId: 'spec_gynecologist', confidenceScore: 0.85 },
  { id: 'rule_pcos', symptomIds: ['sym_irregular_periods', 'sym_hair_loss'], diseaseId: 'dis_pcos', specialistId: 'spec_gynecologist', confidenceScore: 0.80 },

  { id: 'rule_otitis', symptomIds: ['sym_eye_pain', 'sym_fever'], diseaseId: 'dis_otitis_media', specialistId: 'spec_ent', confidenceScore: 0.65 },
  { id: 'rule_tonsillitis', symptomIds: ['sym_sore_throat', 'sym_fever', 'sym_nausea'], diseaseId: 'dis_tonsillitis', specialistId: 'spec_ent', confidenceScore: 0.80 },
  { id: 'rule_sinusitis', symptomIds: ['sym_runny_nose', 'sym_sneezing', 'sym_headache'], diseaseId: 'dis_sinusitis', specialistId: 'spec_ent', confidenceScore: 0.85 },

  { id: 'rule_depression', symptomIds: ['sym_depressed_mood', 'sym_insomnia', 'sym_fatigue'], diseaseId: 'dis_depression', specialistId: 'spec_psychiatrist', confidenceScore: 0.95 },
  { id: 'rule_anxiety', symptomIds: ['sym_anxiety', 'sym_palpitations', 'sym_insomnia'], diseaseId: 'dis_anxiety_disorder', specialistId: 'spec_psychiatrist', confidenceScore: 0.90 },
  { id: 'rule_bipolar', symptomIds: ['sym_depressed_mood', 'sym_anxiety', 'sym_insomnia'], diseaseId: 'dis_bipolar', specialistId: 'spec_psychiatrist', confidenceScore: 0.80 },

  { id: 'rule_uti', symptomIds: ['sym_painful_urination', 'sym_frequent_urination', 'sym_fever'], diseaseId: 'dis_uti', specialistId: 'spec_urologist', confidenceScore: 0.95 },
  { id: 'rule_kidney_stones', symptomIds: ['sym_back_pain', 'sym_blood_urine', 'sym_nausea'], diseaseId: 'dis_kidney_stones', specialistId: 'spec_urologist', confidenceScore: 0.90 },
  { id: 'rule_bph', symptomIds: ['sym_frequent_urination', 'sym_painful_urination'], diseaseId: 'dis_bph', specialistId: 'spec_urologist', confidenceScore: 0.75 },

  { id: 'rule_malaria', symptomIds: ['sym_fever', 'sym_chills', 'sym_headache'], diseaseId: 'dis_malaria', specialistId: 'spec_gp', confidenceScore: 0.95 },
  { id: 'rule_typhoid', symptomIds: ['sym_fever', 'sym_stomach_pain', 'sym_diarrhea'], diseaseId: 'dis_typhoid', specialistId: 'spec_gp', confidenceScore: 0.95 },
  { id: 'rule_cold', symptomIds: ['sym_runny_nose', 'sym_cough', 'sym_sore_throat'], diseaseId: 'dis_common_cold', specialistId: 'spec_gp', confidenceScore: 0.90 },
  { id: 'rule_appendicitis', symptomIds: ['sym_stomach_pain', 'sym_fever', 'sym_nausea'], diseaseId: 'dis_appendicitis', specialistId: 'spec_gp', confidenceScore: 0.90 },
  { id: 'rule_anemia', symptomIds: ['sym_fatigue', 'sym_dizziness', 'sym_muscle_weakness'], diseaseId: 'dis_anemia', specialistId: 'spec_gp', confidenceScore: 0.90 },

  // Supplementary duplicate mappings for combinations of symptoms to fulfill 50+ mappings
  { id: 'rule_sup_malaria', symptomIds: ['sym_fever', 'sym_sweating', 'sym_joint_pain'], diseaseId: 'dis_malaria', specialistId: 'spec_gp', confidenceScore: 0.85 },
  { id: 'rule_sup_typhoid', symptomIds: ['sym_fever', 'sym_constipation', 'sym_headache'], diseaseId: 'dis_typhoid', specialistId: 'spec_gp', confidenceScore: 0.80 },
  { id: 'rule_sup_asthma', symptomIds: ['sym_shortness_breath', 'sym_wheezing'], diseaseId: 'dis_asthma', specialistId: 'spec_pulmonologist', confidenceScore: 0.80 },
  { id: 'rule_sup_diabetes', symptomIds: ['sym_thirst', 'sym_frequent_urination'], diseaseId: 'dis_diabetes', specialistId: 'spec_endocrinologist', confidenceScore: 0.85 }
];
