import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 500,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Emily Larson is a dedicated gynecologist with 3 years of experience in women’s reproductive health. She is committed to providing compassionate and personalized care, with a focus on preventive screenings, early diagnosis, and effective treatment plans. Dr. Larson specializes in managing menstrual disorders, fertility issues, and hormonal imbalances, and offers support through all stages of a woman’s life—from adolescence to menopause.',
        fees: 600,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Sarah Patel is a dedicated Darmatologist with 5 years of experience in women’s reproductive health. She is committed to providing compassionate and personalized care, with a focus on preventive screenings, early diagnosis, and effective treatment plans. Dr. Larson specializes in managing menstrual disorders, fertility issues, and hormonal imbalances, and offers support through all stages of a woman’s life—from adolescence to menopause.',
        fees: 300,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Christopher Lee is a compassionate pediatrician with 2 years of experience in caring for infants, children, and adolescents. He is dedicated to promoting the healthy development of young patients through preventive care, timely vaccinations, and early diagnosis of childhood illnesses. Dr. Lee creates a warm, friendly environment where both children and parents feel supported and understood.',
        fees: 400,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Jennifer Garcia is a skilled neurologist with 4 years of experience in diagnosing and treating disorders of the brain, spine, and nervous system. She is passionate about providing patient-centered care with a focus on early detection, accurate diagnosis, and personalized treatment plans. Dr. Garcia specializes in managing conditions such as migraines, epilepsy, stroke, and neurodegenerative diseases, ensuring each patient receives the highest quality of neurological care.',
        fees: 500,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 500,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr Christopher Davis is a dedicated general physician with 4 years of experience in providing comprehensive primary care to patients of all ages. He focuses on preventive healthcare, early diagnosis, and effective treatment of common illnesses and chronic conditions. Known for his patient-first approach, Dr. Davis takes the time to understand each patients needs and ensures they receive personalized, high-quality medical care for long-term wellness',
        fees: 500,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 600,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Ava Mitchell is a skilled dermatologist with 1 year of experience in diagnosing and treating various skin, hair, and nail conditions. She is passionate about helping patients achieve healthy, radiant skin through personalized care, early diagnosis, and evidence-based treatments. Dr. Mitchell specializes in managing acne, eczema, hair loss, and skin allergies, and offers both medical and cosmetic dermatology services in a friendly and approachable environment.',
        fees: 300,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Jeffrey King is a caring and attentive pediatrician with 2 years of experience in treating infants, children, and adolescents. He is committed to ensuring the healthy growth and development of young patients through preventive care, routine check-ups, immunizations, and early treatment of childhood illnesses. Dr. King builds strong, trust-based relationships with families, creating a supportive and friendly environment for both kids and parent',
        fees: 400,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Zoe Kelly is a knowledgeable neurologist with 4 years of experience in diagnosing and treating a wide range of neurological disorders. She is dedicated to providing compassionate, patient-focused care with an emphasis on early detection, personalized treatment plans, and long-term support. Dr. Kelly specializes in conditions such as migraines, epilepsy, multiple sclerosis, and movement disorders, helping patients manage symptoms and improve their quality of life.',
        fees: 500,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Patrick Harris is a dedicated neurologist with 4 years of experience in diagnosing and treating neurological conditions. With a focus on early diagnosis and effective treatment, Dr. Harris specializes in managing disorders such as epilepsy, stroke, chronic migraines, and neurodegenerative diseases. He takes a holistic approach to care, providing personalized treatment plans to help patients achieve better neurological health and improved quality of life.',
        fees: 500,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Chloe Evans is a dedicated general physician with 4 years of experience providing comprehensive healthcare to patients of all ages. She is passionate about preventive care, early diagnosis, and managing both acute and chronic conditions. Dr. Evans takes the time to build strong relationships with her patients, ensuring they receive personalized, compassionate care to support long-term health and wellness.',
        fees: 500,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Ryan Martinez is a dedicated gynecologist with 3 years of experience in providing specialized care for women’s health. He is committed to offering a comprehensive approach to gynecology, focusing on preventive care, early diagnosis, and personalized treatment plans. Dr. Martinez has expertise in managing menstrual disorders, fertility concerns, and pregnancy-related care, and he is passionate about empowering women to take control of their health through education and compassionate care.',
        fees: 600,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Amelia Hill is a dedicated Dermatologist with 3 years of experience in providing specialized care for women’s health. He is committed to offering a comprehensive approach to gynecology, focusing on preventive care, early diagnosis, and personalized treatment plans. Dr. Martinez has expertise in managing menstrual disorders, fertility concerns, and pregnancy-related care, and he is passionate about empowering women to take control of their health through education and compassionate care.',
        fees: 300,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]