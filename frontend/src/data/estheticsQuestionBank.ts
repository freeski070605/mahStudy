export type QuestionType = 'flashcard' | 'multiple_choice' | 'scenario';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface EstheticsQuestion {
  id: string;
  type: QuestionType;
  category: string;
  difficulty: Difficulty;
  question: string;
  answer: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
}

interface Topic {
  focus: string;
  question: string;
  answer: string;
  distractors: string[];
  explanation: string;
  tags: string[];
  scenario?: string;
  order?: string[];
}

const categoryCounts: Record<string, number> = {
  'Infection Control': 70,
  Microbiology: 35,
  'Safety & Sanitation': 50,
  'Skin Anatomy': 50,
  'Skin Physiology': 35,
  'Skin Disorders & Diseases': 65,
  'Skin Analysis': 35,
  Contraindications: 40,
  'Facial Procedures': 50,
  Massage: 25,
  Exfoliation: 30,
  Extractions: 25,
  Masks: 20,
  'Hair Removal': 45,
  Makeup: 25,
  'Electricity & Machines': 35,
  'Chemistry & Ingredients': 55,
  'Product Knowledge': 40,
  'Body Treatments': 20,
  'Professional Practice': 30,
  'State Board Mixed Scenarios': 70,
};

export const categories = Object.keys(categoryCounts);

const defaultDistractors = [
  'Continue the service and observe the area',
  'Apply a richer moisturizer and proceed',
  'Ask the client to decide without guidance',
  'Use a stronger exfoliant to finish faster',
];

const topic = (
  focus: string,
  question: string,
  answer: string,
  distractors: string[],
  explanation: string,
  tags: string[],
  scenario?: string,
  order?: string[],
): Topic => ({
  focus,
  question,
  answer,
  distractors,
  explanation,
  tags,
  scenario,
  order,
});

const topicsByCategory: Record<string, Topic[]> = {
  'Infection Control': [
    topic('blood exposure', 'A client begins bleeding during an extraction. What is the first required action?', 'Stop the service immediately and follow blood exposure procedures.', ['Continue carefully until the extraction is complete', 'Blot with a bare hand and finish the facial', 'Cover the spot with moisturizer and keep working'], 'Blood exposure requires stopping the service, protecting yourself with gloves, controlling the exposure, discarding contaminated items, and disinfecting surfaces.', ['blood exposure', 'extractions', 'infection control'], 'During a crowded practical setup, a pinpoint bleed appears on the chin.'),
    topic('dropped implement', 'What should happen after a sanitized tweezer falls on the floor?', 'Remove it from service and clean and disinfect it before reuse.', ['Wipe it on a towel and continue', 'Spray perfume on it before using it', 'Place it back on the clean tray'], 'Anything that touches an unclean surface is considered contaminated until cleaned and disinfected according to label directions.', ['implements', 'disinfection']),
    topic('contact time', 'Why must disinfectant remain visibly wet for the full contact time?', 'The product needs the stated time to destroy listed pathogens.', ['It keeps the room smelling clean', 'It prevents products from expiring', 'It makes towels softer after laundering'], 'EPA-registered disinfectants work only when mixed, applied, and left in contact as the label requires.', ['contact time', 'disinfectant']),
    topic('single-use items', 'How should cotton rounds, wooden applicators, and lancets be handled after use?', 'Discard them after one client because they are single-use items.', ['Wash and place them in the dry sanitizer', 'Save them for the same client next visit', 'Disinfect and return them to the drawer'], 'Porous or sharp single-use supplies cannot be reliably disinfected for reuse.', ['single use', 'porous supplies']),
    topic('double dipping', 'Why is double-dipping a wax applicator unsafe?', 'It can transfer microorganisms from the client back into the wax container.', ['It makes wax cool too quickly', 'It prevents hair from sticking to wax', 'It changes the color of hard wax'], 'A used applicator may contain skin cells, body fluids, or microbes, so each dip requires a clean applicator.', ['waxing', 'cross contamination']),
    topic('contagious lesion', 'What should an esthetician do when a client has a weeping, suspicious, or contagious-looking lesion in the service area?', 'Do not perform the service on that area and refer the client to a physician.', ['Cover the lesion with concealer and proceed', 'Extract the lesion to relieve pressure', 'Use high frequency directly over the lesion'], 'Potentially contagious or undiagnosed lesions are outside esthetic scope and may spread infection.', ['lesions', 'referral']),
    topic('glove tear', 'What is the correct response if a glove tears during a contaminated cleanup?', 'Stop, remove the torn glove, wash hands, and put on a new pair.', ['Layer another glove over it without stopping', 'Continue because gloves are optional', 'Rinse the glove and reuse it'], 'A torn glove no longer provides a barrier and must be replaced after hand hygiene.', ['gloves', 'barrier protection']),
    topic('dirty towel', 'What should be done if a towel from the used laundry bin is accidentally placed on the clean cart?', 'Remove the towel and disinfect any surface it touched.', ['Leave it if it looks dry', 'Fold it so the clean side faces up', 'Spray the towel and reuse it'], 'Used linens can contaminate clean storage areas and surfaces.', ['laundry', 'contamination']),
    topic('work surface blood', 'How should blood on a work surface be managed?', 'Wear gloves, remove visible soil, then disinfect with an appropriate product for the required contact time.', ['Wipe once with water only', 'Cover it with a disposable drape', 'Let it dry before the next client'], 'Visible soil must be removed before disinfection can be effective.', ['blood', 'surface disinfection']),
    topic('covered containers', 'Why should disinfected implements be stored in a clean covered container?', 'Covered storage protects clean implements from dust and recontamination.', ['It allows wet tools to dry more slowly', 'It replaces the need for cleaning', 'It makes implements sterile indefinitely'], 'Disinfection is only useful if cleaned items remain protected until use.', ['storage', 'implements']),
    topic('hand hygiene', 'When must hands be washed during a facial service?', 'Before and after each client, after contamination, after glove removal, and before touching clean supplies.', ['Only at the start of the day', 'Only when hands look dirty', 'Only after applying makeup'], 'Hand hygiene breaks the chain of infection at multiple points in the service.', ['hand washing', 'chain of infection']),
    topic('disinfectant mixing', 'What is the safest way to mix disinfectant concentrate?', 'Follow the label dilution exactly and use the required water amount.', ['Add extra concentrate for every client', 'Estimate by color and scent', 'Mix different disinfectants together'], 'Incorrect dilution can make disinfectant ineffective or unsafe.', ['dilution', 'chemical safety']),
    topic('sharps disposal', 'Where should a contaminated lancet be discarded?', 'In an approved sharps container.', ['In the regular trash wrapped in tissue', 'In the laundry hamper', 'In the wax waste bin'], 'Sharps containers reduce puncture injuries and bloodborne exposure.', ['sharps', 'bloodborne pathogens']),
    topic('clean versus disinfect', 'What is the difference between cleaning and disinfecting?', 'Cleaning removes visible soil; disinfecting destroys many pathogens on nonporous surfaces.', ['Cleaning sterilizes all surfaces', 'Disinfecting replaces wiping away debris', 'Both mean rinsing with warm water only'], 'Disinfection is most effective after soil and product residue are removed.', ['cleaning', 'disinfection']),
  ],
  Microbiology: [
    topic('bacteria', 'What are bacteria in esthetics infection control?', 'Single-celled microorganisms that may be harmless, beneficial, or disease-causing.', ['A type of cosmetic pigment', 'Only organisms that live in wax', 'Dead skin cells in the follicle'], 'Understanding bacteria helps estheticians choose appropriate sanitation and disinfection steps.', ['bacteria', 'pathogens']),
    topic('virus', 'Which statement about viruses is most accurate?', 'Viruses require living host cells to multiply.', ['Viruses are destroyed by moisturizer', 'Viruses are visible without magnification', 'Viruses grow only in disinfectant jars'], 'Viruses such as herpes simplex can affect service decisions and require referral when active.', ['virus', 'herpes']),
    topic('fungi', 'What skin signs may suggest a fungal infection?', 'Ring-shaped, itchy, scaly patches or abnormal nail changes.', ['Evenly hydrated skin', 'Temporary pinkness after cleansing', 'A normal freckle with stable color'], 'Suspected fungal infections should not be treated cosmetically in the affected area.', ['fungus', 'referral']),
    topic('spores', 'Why are bacterial spores important in safety education?', 'Some spores are resistant structures that are harder to destroy than active bacteria.', ['Spores are cosmetic beads in scrubs', 'Spores only occur in sunscreen', 'Spores are always beneficial for facials'], 'State board sanitation emphasizes using the correct level of disinfection for the item and risk.', ['spores', 'pathogens']),
    topic('chain of infection', 'What does breaking the chain of infection mean?', 'Interrupting a step that allows pathogens to spread from source to host.', ['Skipping consultation to save time', 'Using the same towel for both hands', 'Choosing the strongest retail product'], 'Hand hygiene, disinfection, PPE, and proper disposal all interrupt transmission.', ['chain of infection', 'transmission']),
    topic('parasites', 'Which client condition suggests a possible parasite concern?', 'Visible lice or nits in hair near the service area.', ['Mild dryness on the cheeks', 'Freckles on sun-exposed skin', 'A healed acne scar'], 'Possible infestations require postponing affected services and referral according to policy.', ['parasites', 'lice']),
    topic('biofilm', 'Why should wet equipment parts be cleaned and dried properly?', 'Moist residue can support microbial buildup and biofilm.', ['Drying makes machines use more electricity', 'Water residue improves product penetration', 'Biofilm is a desired mask texture'], 'Moisture and organic residue create conditions that support microorganisms.', ['biofilm', 'equipment']),
    topic('pathogenic', 'What does pathogenic mean?', 'Capable of causing disease.', ['Able to hydrate the skin', 'Approved for retail sale', 'Free of all microorganisms'], 'Not all microbes cause disease, but pathogenic microbes require infection-control practices.', ['pathogenic', 'microbiology']),
  ],
  'Safety & Sanitation': [
    topic('SDS', 'What information is found on a Safety Data Sheet?', 'Chemical hazards, safe handling, first aid, storage, and spill procedures.', ['Client skin type history only', 'Retail commission rates', 'A list of facial massage movements'], 'SDS access helps staff respond to chemical exposures and store products safely.', ['SDS', 'chemical safety']),
    topic('label directions', 'What is the safest guide for disinfectant use?', 'The manufacturer label and state board rules.', ['Social media tips', 'Color of the bottle', 'Client preference'], 'Labels specify dilution, contact time, surfaces, PPE, and storage.', ['labels', 'disinfectant']),
    topic('ventilation', 'Why is ventilation important when using strong-smelling products?', 'It reduces inhalation exposure and keeps the treatment room safer.', ['It makes extraction easier', 'It replaces gloves', 'It changes skin pH permanently'], 'Good ventilation supports both client comfort and occupational safety.', ['ventilation', 'salon safety']),
    topic('electrical cords', 'How should electrical cords be managed in a treatment room?', 'Keep them intact, dry, and away from walking paths or wet areas.', ['Run them under wet towels', 'Wrap damaged cords with facial gauze', 'Plug many machines into one overloaded strip'], 'Cord safety reduces shock, trip, and fire risks.', ['electrical safety', 'trips']),
    topic('ergonomics', 'Why should an esthetician adjust stool and table height?', 'To reduce strain and maintain safe body mechanics.', ['To shorten disinfectant contact time', 'To make products more acidic', 'To avoid documenting services'], 'Ergonomics protects the professional from repetitive stress injuries.', ['ergonomics', 'body mechanics']),
    topic('fire safety', 'How should flammable products be stored?', 'Away from heat, sparks, and open flames in approved containers.', ['Next to a towel warmer', 'Beside a lit candle', 'Mixed with disinfectant concentrate'], 'Many solvents and aerosols are flammable and require careful storage.', ['flammable', 'storage']),
    topic('laundry', 'How should used linens be handled?', 'Place them in a closed, labeled container and launder with appropriate detergent and heat.', ['Shake them out near clean supplies', 'Reuse if dry', 'Store them with disinfected tools'], 'Used linens can carry soil and microorganisms, so they must be separated from clean items.', ['laundry', 'linens']),
    topic('client fall', 'What is the first priority if a client slips in the treatment room?', 'Assess safety, do not move an injured client unnecessarily, and follow emergency procedures.', ['Finish retail recommendations first', 'Ask them to sign a new intake form immediately', 'Ignore it if they stand up quickly'], 'Client injuries require calm safety response, documentation, and emergency support when needed.', ['emergency', 'client safety']),
    topic('burn response', 'What should be done first if hot wax burns a client?', 'Stop the service and cool the area according to first-aid guidelines.', ['Apply another wax layer', 'Rub vigorously with oil', 'Cover the area with makeup'], 'Burns require immediate first-aid response and documentation.', ['burns', 'first aid']),
    topic('clean setup', 'What does a sanitary setup include before the client enters?', 'Disinfected surfaces, protected clean implements, fresh linens, and labeled products.', ['Open product jars from previous clients', 'Used brushes drying on the bed', 'Tools loose in a handbag'], 'A clean setup reduces cross-contamination and supports a professional service.', ['setup', 'sanitation']),
  ],
  'Skin Anatomy': [
    topic('epidermis', 'What is the epidermis?', 'The outermost layer of skin that forms a protective barrier.', ['A facial muscle', 'The deepest fatty tissue', 'A gland that produces sebum'], 'The epidermis is the primary visible layer treated in esthetics.', ['epidermis', 'barrier']),
    topic('dermis', 'What structures are found in the dermis?', 'Collagen, elastin, blood vessels, nerves, follicles, and glands.', ['Only dead corneocytes', 'Nail polish pigments', 'Wax polymers only'], 'The dermis supports skin strength, sensation, and nourishment.', ['dermis', 'collagen']),
    topic('stratum corneum', 'What is the stratum corneum?', 'The outer layer of flattened dead cells that helps protect against water loss.', ['The oil gland opening', 'The deepest epidermal layer', 'The muscle used for smiling'], 'Many exfoliation and barrier-care decisions focus on the stratum corneum.', ['stratum corneum', 'barrier']),
    topic('melanocytes', 'What do melanocytes produce?', 'Melanin pigment.', ['Sebum', 'Keratin fibers for hair only', 'Lymph fluid'], 'Melanin helps determine skin color and contributes to UV protection.', ['melanin', 'pigment']),
    topic('sebaceous glands', 'What do sebaceous glands produce?', 'Sebum that lubricates skin and hair.', ['Sweat only', 'Collagen fibers', 'Keratinocytes'], 'Sebum level influences acne risk and product selection.', ['sebum', 'oil glands']),
    topic('sudoriferous glands', 'What is the function of sweat glands?', 'They excrete sweat and help regulate body temperature.', ['They produce melanin', 'They create collagen', 'They remove comedones'], 'Sweat glands are part of thermoregulation and excretion.', ['sweat glands', 'physiology']),
    topic('collagen', 'What does collagen provide in the skin?', 'Strength and structural support.', ['Oil flow through follicles', 'Surface pigment only', 'A cleansing action'], 'Collagen decline contributes to visible aging and laxity.', ['collagen', 'aging']),
    topic('elastin', 'What does elastin provide?', 'Elasticity and the ability for skin to spring back.', ['Hair removal grip', 'Chemical neutralization', 'Bacterial protection only'], 'Sun damage and aging can reduce elastic quality.', ['elastin', 'aging']),
    topic('follicle', 'What is a hair follicle?', 'A tube-like opening in the skin that contains the hair root and connects with sebaceous glands.', ['A capillary in the dermis', 'A makeup brush shape', 'A type of disinfectant'], 'Follicles are central to acne, hair removal, and comedone formation.', ['follicle', 'hair']),
    topic('hypodermis', 'What is the hypodermis?', 'The subcutaneous layer containing fat and connective tissue beneath the dermis.', ['The acid mantle', 'The top layer of dead cells', 'A type of facial mask'], 'The hypodermis cushions and insulates but is not the primary target of esthetic services.', ['hypodermis', 'subcutaneous']),
  ],
  'Skin Physiology': [
    topic('barrier function', 'What is the purpose of the skin barrier?', 'To limit water loss and protect against irritants and microorganisms.', ['To remove all oil permanently', 'To make exfoliation unnecessary', 'To produce all hormones'], 'Healthy barrier function is essential for comfort, resilience, and service tolerance.', ['barrier', 'TEWL']),
    topic('acid mantle', 'What is the acid mantle?', 'A slightly acidic protective film made of sebum, sweat, and skin secretions.', ['A neutralizing cream only used after waxing', 'A layer of muscle under the dermis', 'A machine electrode coating'], 'The acid mantle supports barrier health and discourages some microbial growth.', ['acid mantle', 'pH']),
    topic('cell turnover', 'What does cell turnover describe?', 'The movement of new cells upward as older surface cells shed.', ['Sebum becoming sweat', 'Blood turning into lymph', 'Wax changing from soft to hard'], 'Turnover affects texture, dullness, and exfoliation planning.', ['cell turnover', 'desquamation']),
    topic('TEWL', 'What does transepidermal water loss mean?', 'Water evaporating from inside the skin through the epidermis.', ['Oil production in follicles', 'Pigment moving to the surface', 'Sweat trapped by powder'], 'High TEWL often indicates impaired barrier and dehydration.', ['TEWL', 'dehydration']),
    topic('inflammation', 'What are common signs of inflammation?', 'Redness, heat, swelling, pain, and sometimes impaired function.', ['Even tone and normal comfort', 'Matte finish only', 'Stable freckles'], 'Inflammation guides decisions to calm, avoid aggressive services, and refer when necessary.', ['inflammation', 'sensitivity']),
    topic('sebaceous activity', 'What can increased sebaceous activity contribute to?', 'Oiliness, shine, and acne-prone follicles.', ['Permanent dehydration', 'Loss of all pigment', 'Fungal nail infection'], 'Product choices should balance oil control without stripping the barrier.', ['sebum', 'acne']),
    topic('wound healing', 'Why should an esthetician avoid treating open skin?', 'Open skin is more vulnerable to infection and irritation.', ['Open skin absorbs makeup better', 'Open skin is always healthy', 'Open skin eliminates contraindications'], 'Open lesions require protection, possible referral, and postponed cosmetic service.', ['wound healing', 'contraindication']),
  ],
  'Skin Disorders & Diseases': [
    topic('herpes simplex', 'What should an esthetician do if a client has an active cold sore?', 'Postpone services that affect the area and refer or advise medical care as appropriate.', ['Massage directly over it', 'Apply wax to remove crusting', 'Extract it to shorten healing'], 'Active herpes lesions are contagious and contraindicate services in the area.', ['herpes', 'contagious'], 'A client arrives with tingling and clustered blisters near the lip.'),
    topic('inflamed acne', 'How should severe inflamed acne be approached?', 'Avoid aggressive manipulation and refer for medical evaluation when appropriate.', ['Perform deep extractions on every lesion', 'Use a coarse scrub until smooth', 'Apply hot wax over pustules'], 'Inflamed acne can worsen with trauma and may need medical care.', ['acne', 'inflammation']),
    topic('rosacea flare', 'What service approach fits a rosacea flare?', 'Use gentle, cooling, fragrance-free care and avoid heat and vigorous massage.', ['Use hot steam and strong scrubs', 'Apply stimulating peel layers', 'Perform firm friction massage'], 'Rosacea-prone skin is reactive to heat, friction, and strong stimulation.', ['rosacea', 'sensitive skin']),
    topic('suspicious mole', 'What should be done when a mole has changing color, irregular borders, or bleeding?', 'Do not treat over it and refer the client to a physician.', ['Lighten it with a peel', 'Cover it with wax', 'Extract it as a blackhead'], 'Potential skin cancer signs are outside esthetic scope and require medical evaluation.', ['ABCDE', 'referral']),
    topic('impetigo', 'Which signs may suggest impetigo?', 'Honey-colored crusts, weeping lesions, and contagious-looking sores.', ['Stable freckles', 'Dry cheeks only', 'Fine expression lines'], 'Suspected bacterial infections require postponing affected services and referral.', ['impetigo', 'infection']),
    topic('eczema', 'What is appropriate when eczema is irritated or cracked?', 'Avoid treatment over active irritation and choose gentle barrier support.', ['Use a strong granular scrub', 'Wax directly over cracks', 'Apply high heat to dry patches'], 'Compromised eczema-prone skin can sting, tear, or become infected.', ['eczema', 'barrier']),
    topic('psoriasis', 'How should visible psoriasis plaques be handled?', 'Avoid manipulating plaques and proceed only where permitted and comfortable.', ['Pick off scale before the facial', 'Use hard wax over plaques', 'Treat plaques as comedones'], 'Plaques can crack or bleed and may require medical guidance.', ['psoriasis', 'contraindication']),
    topic('fungal infection', 'What is the correct response to suspected ringworm in the service area?', 'Postpone service on the area and refer for medical care.', ['Apply a mask to hide it', 'Exfoliate until the border fades', 'Massage over it with oil'], 'Fungal infections are contagious and outside cosmetic treatment scope.', ['fungus', 'ringworm']),
    topic('open lesion', 'Why is an open lesion a contraindication?', 'It increases infection risk and may be aggravated by products or touch.', ['It means exfoliation will work better', 'It has no effect on sanitation', 'It confirms the skin is hydrated'], 'Open skin should not be treated cosmetically until healed or cleared.', ['open lesion', 'safety']),
    topic('unexplained rash', 'What should an esthetician do with an unexplained rash?', 'Avoid treatment on the affected area and recommend medical evaluation.', ['Diagnose it as acne', 'Apply wax to remove it', 'Use high frequency until it disappears'], 'Estheticians do not diagnose rashes; unexplained changes require caution and referral.', ['rash', 'scope']),
    topic('milia', 'What are milia?', 'Small keratin-filled cysts often appearing as firm white bumps.', ['Active viral blisters', 'Open pustules', 'A form of bruising'], 'Milia are not extracted like soft comedones and may require permitted techniques or referral.', ['milia', 'keratin']),
    topic('comedones', 'What is a comedone?', 'A follicle blocked with sebum and dead cells.', ['A contagious fungal patch', 'A swollen lymph node', 'A type of muscle'], 'Open and closed comedones are common acne lesions considered during skin analysis.', ['comedones', 'acne']),
    topic('telangiectasia', 'What are telangiectasias?', 'Visible small dilated capillaries near the skin surface.', ['Deep muscle knots', 'Blackheads on the nose', 'A type of wax bead'], 'Visible capillaries are treated gently and protected from heat and pressure.', ['capillaries', 'redness']),
  ],
  'Skin Analysis': [
    topic('consultation timing', 'When should skin analysis occur in a facial?', 'After cleansing and before treatment product selection.', ['After the final SPF', 'Before greeting the client', 'Only after massage'], 'Clean skin allows a more accurate view of oil, dehydration, texture, lesions, and sensitivity.', ['skin analysis', 'facial order']),
    topic('Fitzpatrick', 'Why is Fitzpatrick type considered?', 'It helps estimate UV response and pigmentation risk.', ['It identifies exact product allergies', 'It replaces consultation', 'It measures pore size only'], 'Fitzpatrick classification is one factor in planning sun protection and exfoliation caution.', ['Fitzpatrick', 'pigment']),
    topic('dehydrated skin', 'Which sign suggests dehydration?', 'Fine crisscross lines, tightness, and lack of water despite possible oil.', ['Only thick callus on heels', 'Active cold sore clusters', 'A broken capillary only'], 'Dehydration is water deficiency and can occur in any skin type.', ['dehydration', 'analysis']),
    topic('oily skin', 'What analysis finding suggests oily skin?', 'Shine, enlarged-looking pores, and excess sebum through the T-zone or face.', ['Flaking with no oil ever', 'Loss of all pigment', 'Clusters of viral blisters'], 'Oily skin benefits from balanced cleansing, light hydration, and noncomedogenic products.', ['oily skin', 'sebum']),
    topic('sensitive skin', 'What clues suggest sensitive skin?', 'Stinging history, redness, flushing, or reactivity to products.', ['Uniform comfort with all actives', 'Heavy callus only', 'Permanent makeup color'], 'Sensitive clients need patch testing, gentle products, and conservative treatment.', ['sensitive skin', 'consultation']),
    topic('combination skin', 'What defines combination skin?', 'Oilier areas in some zones with drier or normal areas elsewhere.', ['Only active infection', 'Skin that cannot be cleansed', 'Skin with no follicle openings'], 'Combination skin may need zone-specific product choices.', ['combination skin', 'skin type']),
    topic('contraindication check', 'Why ask about medications during analysis?', 'Medications can affect sensitivity, healing, pigmentation, or waxing safety.', ['Medication history is only for retail sales', 'It determines towel color', 'It replaces sanitation'], 'Retinoids, isotretinoin history, antibiotics, and photosensitizers can change service planning.', ['medications', 'consultation']),
  ],
  Contraindications: [
    topic('isotretinoin', 'Why is recent isotretinoin use a waxing contraindication?', 'It can make skin fragile and more likely to lift or tear.', ['It makes wax too cold', 'It prevents hair from growing', 'It disinfects the skin automatically'], 'Strong acne medications can affect skin integrity and healing.', ['isotretinoin', 'waxing']),
    topic('retinoids', 'What should be done before waxing a client using topical retinoids?', 'Avoid or postpone waxing in the affected area according to policy and manufacturer guidance.', ['Wax twice to remove peeling skin', 'Use hotter wax', 'Skip consultation'], 'Retinoids increase exfoliation and can raise the risk of skin lifting.', ['retinol', 'contraindication']),
    topic('sunburn', 'How should sunburned skin be handled?', 'Postpone exfoliation, waxing, heat, and massage over the area.', ['Apply a peel to remove damaged skin', 'Wax gently over redness', 'Use hot steam longer'], 'Sunburn is inflamed damaged skin and should not receive stimulating services.', ['sunburn', 'inflammation']),
    topic('pacemaker', 'Why is a pacemaker important before electrical treatments?', 'Electrical services may be contraindicated and require avoidance or medical clearance.', ['It only affects mask choice', 'It makes cleanser ineffective', 'It means waxing is always required'], 'Client health devices can interact with electrical modalities.', ['pacemaker', 'machines']),
    topic('pregnancy caution', 'How should pregnancy be handled in treatment planning?', 'Use conservative positioning and products, and follow scope, policy, and provider guidance for modalities.', ['Assume every machine is safe', 'Skip all documentation', 'Use strongest peel to save time'], 'Pregnancy can change sensitivity and contraindicate some services or positions.', ['pregnancy', 'caution']),
    topic('allergy', 'What is the safest response to a known ingredient allergy?', 'Avoid products containing the allergen and document the allergy.', ['Use a smaller amount of the allergen', 'Cover the reaction with makeup', 'Ask the client to ignore mild symptoms'], 'Allergy history guides product selection and risk reduction.', ['allergy', 'consultation']),
    topic('open wound', 'What is the service decision for an open wound in the treatment area?', 'Do not treat over the wound and protect the client from contamination.', ['Exfoliate around and inside the wound', 'Wax over it quickly', 'Use toner to sterilize it'], 'Open wounds are infection risks and outside cosmetic treatment.', ['open wound', 'infection']),
    topic('contagious disease', 'What should happen if contagious symptoms appear in the service area?', 'Postpone affected services and follow referral and sanitation procedures.', ['Perform only extractions', 'Use a heavier mask', 'Ignore if covered by hair'], 'Contagious conditions can spread to the provider, other clients, and surfaces.', ['contagious', 'referral']),
  ],
  'Facial Procedures': [
    topic('facial order', 'What is a common basic facial order?', 'Consultation, cleanse, analyze, exfoliate as appropriate, steam if appropriate, extractions if appropriate, massage, mask, tone, moisturize, SPF.', ['Mask, SPF, consultation, extract, cleanse', 'Massage before cleansing, then wax, then analyze', 'Steam after final sunscreen only'], 'Facials follow a logical order that supports analysis, safety, product performance, and protection.', ['procedure order', 'facial']),
    topic('cleanse first', 'Why cleanse before analysis?', 'Cleansing removes makeup and surface debris so skin can be evaluated accurately.', ['It replaces consultation', 'It closes every follicle permanently', 'It diagnoses disease'], 'Analysis on uncleansed skin may confuse product residue with skin conditions.', ['cleansing', 'analysis']),
    topic('steam timing', 'When is steam commonly used?', 'After analysis and before extractions when not contraindicated.', ['Before consultation', 'After final SPF', 'Over inflamed rosacea automatically'], 'Steam can soften debris but is avoided for heat-sensitive or contraindicated skin.', ['steam', 'facial order']),
    topic('extraction caution', 'When should extractions be avoided?', 'On inflamed, infected, fragile, or contraindicated lesions.', ['On every visible pore', 'Only when cleanser was used', 'Whenever a client requests hydration'], 'Unsafe extractions can injure tissue and spread infection.', ['extractions', 'contraindications']),
    topic('mask timing', 'When is a mask usually applied in a basic facial?', 'After massage or extractions, before finishing products.', ['Before the first cleanse', 'After the client leaves', 'Before consultation paperwork'], 'Masks are selected to calm, hydrate, absorb oil, or support the treatment goal.', ['mask', 'facial order']),
    topic('finish products', 'How should most daytime facials be finished?', 'With appropriate moisturizer and broad-spectrum SPF.', ['With a strong peel and no sunscreen', 'With wax remover only', 'With disinfectant on the skin'], 'SPF helps protect newly treated skin from UV exposure.', ['SPF', 'finishing']),
    topic('sensitive facial', 'Which product approach fits sensitive skin?', 'Fragrance-free, gentle, barrier-supporting products with minimal stimulation.', ['Strong scrub and hot towels repeatedly', 'High alcohol toner every layer', 'Maximum-strength peel by default'], 'Sensitive skin benefits from calm, low-irritant choices.', ['sensitive skin', 'product selection']),
    topic('oily facial', 'Which product approach fits oily but dehydrated skin?', 'Balance oil with gentle cleansing, light hydration, and noncomedogenic products.', ['Strip oil until skin feels tight', 'Avoid all moisturizer', 'Use heavy occlusive balm on every layer'], 'Oily skin can still lack water and needs barrier-safe hydration.', ['oily skin', 'hydration']),
    topic('client comfort', 'What should the esthetician do when a client reports burning during a product step?', 'Remove the product promptly, assess the skin, and document the response.', ['Tell the client burning means it is working', 'Fan the skin but leave product on longer', 'Add a stronger active'], 'Burning can signal irritation or adverse response and should be addressed immediately.', ['adverse reaction', 'client comfort']),
    topic('post-care', 'What post-care should follow exfoliation or extractions?', 'Use gentle products, avoid picking, limit sun exposure, and wear SPF.', ['Scrub twice daily immediately', 'Tan to dry the skin', 'Apply multiple new actives that night'], 'Post-care reduces irritation and supports healing.', ['aftercare', 'SPF']),
  ],
  Massage: [
    topic('effleurage', 'What is effleurage?', 'A light, continuous stroking movement used to apply product and soothe tissue.', ['A tapping movement', 'A kneading movement only for extractions', 'A type of chemical peel'], 'Effleurage begins and ends many massage sequences because it is calming and connecting.', ['effleurage', 'massage']),
    topic('petrissage', 'What is petrissage?', 'A kneading or lifting massage movement.', ['A feather-light finishing stroke only', 'A machine current', 'A disinfectant method'], 'Petrissage can stimulate tissue and should be adjusted for client tolerance.', ['petrissage', 'massage']),
    topic('tapotement', 'What is tapotement?', 'Rhythmic tapping or percussion movements.', ['A static mask placement', 'A waxing removal method', 'A patch test'], 'Tapotement is stimulating and may be avoided on highly sensitive skin.', ['tapotement', 'massage']),
    topic('massage contraindication', 'When should facial massage be avoided or modified?', 'With inflammation, contagious conditions, open lesions, recent procedures, or client discomfort.', ['Whenever skin is normal', 'Only when moisturizer is available', 'After every wax by default'], 'Massage increases circulation and friction, which can worsen some conditions.', ['contraindications', 'massage']),
    topic('pressure', 'How should pressure be selected during facial massage?', 'Use light to moderate pressure based on area, skin condition, and client feedback.', ['Use deep pressure over all capillaries', 'Use the same pressure for every client', 'Increase pressure if skin becomes red'], 'Pressure must respect delicate facial structures and reactive skin.', ['pressure', 'client comfort']),
  ],
  Exfoliation: [
    topic('mechanical exfoliation', 'What is mechanical exfoliation?', 'Physical removal of surface cells with a tool, scrub, brush, or device.', ['Dissolving cells with acids only', 'Adding oil to the skin', 'Disinfecting implements'], 'Mechanical methods require pressure control and contraindication screening.', ['mechanical exfoliation', 'scrub']),
    topic('chemical exfoliation', 'What is chemical exfoliation?', 'Use of acids or enzymes to loosen bonds between surface cells.', ['Manual tweezing', 'High frequency sparking only', 'Applying sunscreen'], 'Chemical exfoliation varies by ingredient, pH, strength, and exposure time.', ['chemical exfoliation', 'AHA']),
    topic('enzyme', 'What is an enzyme exfoliant commonly used for?', 'Digesting surface keratin gently when appropriate.', ['Sterilizing tweezers', 'Adding permanent pigment', 'Removing terminal hair from the root'], 'Enzymes can be gentler but still require sensitivity screening.', ['enzyme', 'keratin']),
    topic('over-exfoliation', 'Which signs suggest over-exfoliation?', 'Stinging, redness, tight shine, flaking, and barrier discomfort.', ['Normal comfort and even tone', 'Improved barrier with no sensitivity', 'Stable freckles only'], 'Over-exfoliated skin needs barrier repair and reduced active use.', ['barrier', 'over exfoliation']),
    topic('AHA selection', 'What skin concern often benefits from AHA exfoliation when appropriate?', 'Dryness, dullness, uneven texture, and some hyperpigmentation concerns.', ['Active open wounds', 'Fresh sunburn', 'Contagious lesions'], 'AHAs are water-soluble exfoliants often used for surface texture and discoloration support.', ['AHA', 'glycolic acid']),
    topic('BHA selection', 'Why is salicylic acid useful for oily or acne-prone skin?', 'It is oil-soluble and can help exfoliate within the follicle.', ['It is a wax remover', 'It permanently closes pores', 'It replaces disinfection'], 'BHA is often selected for comedone-prone skin when not contraindicated.', ['BHA', 'salicylic acid']),
  ],
  Extractions: [
    topic('softening', 'What helps prepare skin for safe comedone extractions?', 'Proper cleansing, analysis, softening, and sanitation.', ['Skipping gloves', 'Using dry pressure on inflamed pustules', 'Extracting before consultation'], 'Preparation reduces trauma and supports clean technique.', ['extractions', 'preparation']),
    topic('pressure angle', 'How should pressure be applied during manual extraction?', 'Gently and evenly around the follicle, stopping if the lesion does not release.', ['Directly gouge the center', 'Use fingernails for sharper pressure', 'Force until bruising appears'], 'Aggressive extraction can bruise, scar, or spread infection.', ['manual extraction', 'technique']),
    topic('inflamed pustule', 'What should be done with inflamed pustules?', 'Avoid aggressive extraction and follow scope and safety rules.', ['Pop every pustule with fingernails', 'Wax over them', 'Scrub until they open'], 'Inflamed lesions are more likely to worsen or spread bacteria with trauma.', ['pustules', 'contraindication']),
    topic('post extraction', 'What follows extractions in a sanitary facial?', 'Soothe the skin, use appropriate antiseptic or calming steps per policy, and avoid contamination.', ['Apply dirty towel compresses', 'Skip hand hygiene', 'Apply thick theatrical makeup immediately'], 'Post-extraction care should calm tissue and maintain cleanliness.', ['aftercare', 'sanitation']),
    topic('comedone choice', 'Which lesion is most appropriate for careful esthetic extraction?', 'A noninflamed open comedone that releases with gentle pressure.', ['A suspicious bleeding mole', 'A cold sore blister', 'A fungal ring lesion'], 'Estheticians should avoid lesions that are contagious, inflamed, suspicious, or outside scope.', ['comedones', 'scope']),
  ],
  Masks: [
    topic('clay mask', 'What is a clay mask best suited for?', 'Absorbing oil and helping refine the feel of oily skin.', ['Adding heavy occlusion to cracked skin only', 'Removing terminal hair', 'Sterilizing surfaces'], 'Clay masks can be helpful for oiliness but may over-dry sensitive or dehydrated skin.', ['clay mask', 'oily skin']),
    topic('cream mask', 'What skin condition often benefits from a cream mask?', 'Dry or mature skin needing comfort and emollience.', ['Very oily skin needing degreasing only', 'Active contagious lesions', 'Fresh burns'], 'Cream masks can soften and support dry-feeling skin.', ['cream mask', 'dry skin']),
    topic('gel mask', 'Why select a gel mask?', 'To cool, hydrate, or calm when appropriate.', ['To perform deep extractions', 'To disinfect lancets', 'To replace sunscreen permanently'], 'Gel masks often feel soothing for dehydrated or sensitive clients.', ['gel mask', 'hydration']),
    topic('setting mask', 'What precaution applies to setting or alginate-style masks?', 'Protect brows, lashes, nostrils, and client comfort before application.', ['Apply over open lesions', 'Let it cover the nostrils', 'Remove with metal tweezers only'], 'Occlusive setting masks require careful application and monitoring.', ['alginate', 'mask safety']),
  ],
  'Hair Removal': [
    topic('soft wax removal', 'How is soft wax usually removed?', 'With a strip pulled quickly opposite the direction of hair growth while supporting the skin.', ['Slowly in the direction of growth with no support', 'By rinsing with water only', 'By scraping with tweezers'], 'Skin support and correct direction reduce discomfort and skin lifting.', ['soft wax', 'technique']),
    topic('hard wax', 'Why choose hard wax for some sensitive areas?', 'It shrink-wraps around hair and is removed without a strip.', ['It is safe over every contraindication', 'It never requires sanitation', 'It is used only for nails'], 'Hard wax can be useful for coarse hair and smaller sensitive areas when appropriate.', ['hard wax', 'hair removal']),
    topic('patch test', 'Why perform a wax patch test when indicated?', 'To check for sensitivity or adverse response before a larger service.', ['To make hair grow faster', 'To disinfect the wax pot', 'To replace the intake form'], 'Patch tests reduce risk for clients with sensitivity or new products.', ['patch test', 'sensitivity']),
    topic('post wax', 'Which post-wax advice is appropriate?', 'Avoid heat, friction, sun, heavy sweating, and exfoliation for the recommended period.', ['Tan immediately', 'Apply retinoid the same night', 'Scrub aggressively that day'], 'Freshly waxed skin is more vulnerable to irritation and follicle inflammation.', ['aftercare', 'waxing']),
    topic('sunburn waxing', 'What should be done if a client wants waxing over sunburn?', 'Decline or postpone waxing over sunburned skin.', ['Use hotter wax to remove peeling', 'Wax twice for smoothness', 'Apply fragrance first'], 'Sunburned skin is inflamed and more likely to lift or tear.', ['sunburn', 'waxing']),
    topic('thin skin', 'What is a concern with thin or fragile skin during hair removal?', 'Skin lifting, tearing, bruising, or irritation.', ['Wax will not stick to hair', 'Hair becomes immune to removal', 'Disinfectant stops working'], 'Fragile skin needs conservative method selection and may be contraindicated.', ['fragile skin', 'contraindication']),
    topic('tweezing', 'What is proper tweezing technique?', 'Hold skin taut and remove hair in the direction of growth with sanitized tweezers.', ['Pull against growth with dirty tweezers', 'Break hair above the surface', 'Share tweezers without disinfection'], 'Correct tweezing reduces breakage and contamination risk.', ['tweezing', 'sanitation']),
    topic('wax temperature', 'How should wax temperature be checked?', 'Test it safely before application and monitor client comfort.', ['Apply directly from warmer to face', 'Assume hotter wax removes hair better', 'Use client redness as the test'], 'Overheated wax can burn the client.', ['wax temperature', 'burn prevention']),
    topic('double dip waxing', 'Why use a new applicator for each wax dip?', 'To prevent contaminating the wax with client skin cells or microorganisms.', ['To make wax more acidic', 'To slow the service on purpose', 'To reduce hair grip'], 'Wax containers must be protected from cross-contamination.', ['double dipping', 'infection control']),
  ],
  Makeup: [
    topic('sanitary makeup', 'How should makeup testers be used safely?', 'Dispense with clean, disposable applicators and avoid touching shared products to skin.', ['Apply lipstick directly from the tube', 'Double dip mascara wands', 'Share used sponges between clients'], 'Makeup tools and testers can spread microorganisms if handled unsafely.', ['makeup sanitation', 'testers']),
    topic('color correction', 'Which color helps visually neutralize redness?', 'Green-toned corrector used sparingly under complexion product.', ['Orange on every red area', 'Black powder', 'Clear gloss'], 'Opposite colors on the color wheel can visually balance discoloration.', ['color theory', 'redness']),
    topic('foundation matching', 'Where is foundation commonly tested for face matching?', 'Along the jawline in suitable lighting.', ['On the palm only', 'On a tissue', 'Inside the wax pot'], 'Jawline testing helps compare face, neck, and undertone.', ['foundation', 'color match']),
    topic('contraindicated makeup', 'When should makeup application be postponed or modified?', 'Over contagious lesions, open skin, or active irritation.', ['Whenever the client has normal skin', 'Only if brushes are clean', 'When SPF was used'], 'Makeup can contaminate tools or irritate compromised skin.', ['contraindication', 'makeup']),
    topic('brush cleaning', 'What should happen to makeup brushes between clients?', 'Clean and disinfect them according to product and tool requirements.', ['Blow on them and reuse', 'Store used brushes with clean ones', 'Rinse only once a week'], 'Reusable makeup tools must be decontaminated before use on another client.', ['brushes', 'disinfection']),
  ],
  'Electricity & Machines': [
    topic('galvanic current', 'What is galvanic current?', 'A direct current used for specific esthetic effects such as desincrustation or iontophoresis.', ['A type of towel warmer', 'An alternating tapping massage', 'A wax temperature setting'], 'Galvanic services require training, polarity awareness, and contraindication screening.', ['galvanic', 'electricity']),
    topic('high frequency', 'What is high frequency commonly used for?', 'A germicidal, drying, or soothing effect depending on technique and skin condition.', ['Melting hard wax', 'Sterilizing all tools', 'Replacing consultation'], 'High frequency uses alternating current through glass electrodes and requires safety checks.', ['high frequency', 'electrotherapy']),
    topic('LED therapy', 'What is LED therapy?', 'Use of visible light wavelengths for cosmetic skin support within scope.', ['A chemical peel acid', 'A manual extraction tool', 'A disinfectant concentrate'], 'LED services still require eye protection, contraindication screening, and realistic claims.', ['LED', 'machines']),
    topic('microcurrent', 'Why is microcurrent screened carefully?', 'It uses low-level electrical current and is not appropriate for some medical conditions or devices.', ['It contains strong perfume', 'It removes hair from the root', 'It replaces SPF'], 'Electrical modalities must consider pacemakers, implants, seizure history, pregnancy policy, and other contraindications.', ['microcurrent', 'contraindications']),
    topic('electrode cleaning', 'How should reusable electrodes be handled?', 'Clean and disinfect them according to manufacturer instructions after each client.', ['Store with gel still on them', 'Rinse only with facial toner', 'Share without cleaning if dry'], 'Machine accessories contact skin and must be decontaminated properly.', ['electrodes', 'sanitation']),
    topic('metal implants', 'Why ask about metal implants before some machine services?', 'Metal can affect safety decisions for certain electrical or energy-based treatments.', ['Metal improves all current flow safely', 'It means the client cannot receive cleanser', 'It only affects makeup color'], 'Health history determines whether a modality should be avoided or cleared medically.', ['metal implants', 'screening']),
    topic('machine inspection', 'What should be checked before using a machine?', 'Cords, plugs, settings, accessories, sanitation, and contraindications.', ['Only the color of the machine', 'Whether the client likes technology', 'If the room is decorated'], 'Pre-service inspection prevents avoidable safety problems.', ['machine safety', 'setup']),
  ],
  'Chemistry & Ingredients': [
    topic('pH scale', 'What does the pH scale measure?', 'How acidic or alkaline a substance is.', ['How much a product costs', 'How shiny packaging is', 'How many ounces are in a jar'], 'pH influences skin comfort, barrier function, and exfoliant activity.', ['pH', 'chemistry']),
    topic('neutral pH', 'What is neutral on the pH scale?', '7.', ['0', '3.5', '14'], 'Pure water is commonly used as the reference for neutral pH.', ['pH', 'neutral']),
    topic('acidic', 'Where are acids found on the pH scale?', 'Below 7.', ['Above 7 only', 'Exactly 14', 'Only at 7'], 'Many exfoliating acids have low pH and require careful use.', ['acid', 'pH']),
    topic('alkaline', 'Where are alkaline substances found on the pH scale?', 'Above 7.', ['Below 7 only', 'Exactly 0', 'Only in sunscreen'], 'Highly alkaline products can disrupt the skin barrier if misused.', ['alkaline', 'pH']),
    topic('humectants', 'What do humectants do?', 'Attract water to the skin.', ['Block all water evaporation as a heavy seal only', 'Dissolve hair from follicles', 'Sterilize implements'], 'Hyaluronic acid, glycerin, and similar ingredients support hydration.', ['humectant', 'hydration']),
    topic('emollients', 'What do emollients do?', 'Soften and smooth the feel of the skin.', ['Kill all microbes', 'Make wax hotter', 'Remove pigment permanently'], 'Emollients help improve comfort and texture.', ['emollient', 'moisturizer']),
    topic('occlusives', 'What do occlusives do?', 'Reduce water loss by forming a protective seal on the skin.', ['Increase UV exposure', 'Neutralize every acid', 'Create comedones in every client'], 'Occlusives can be helpful for dryness but should be selected for skin type.', ['occlusive', 'TEWL']),
    topic('ceramides', 'Why are ceramides used in skin care?', 'They support the lipid barrier.', ['They are abrasive beads', 'They bleach hair', 'They disinfect wax pots'], 'Ceramides are barrier lipids that help comfort dry or compromised skin.', ['ceramides', 'barrier']),
    topic('retinol', 'What is retinol commonly used for?', 'Improving the appearance of aging, texture, and some acne concerns over time.', ['Immediate hair removal', 'Surface disinfection', 'Neutralizing all allergies'], 'Retinoids can increase sensitivity, so they affect waxing and exfoliation decisions.', ['retinol', 'vitamin A']),
    topic('benzoyl peroxide', 'What is benzoyl peroxide commonly used for?', 'Acne-prone skin because it helps reduce acne-causing bacteria and oil-related breakouts.', ['Darkening lashes', 'Moisturizing cracked skin only', 'Making wax reusable'], 'It can be drying or irritating and may bleach fabrics.', ['benzoyl peroxide', 'acne']),
    topic('sunscreen', 'What does broad-spectrum sunscreen protect against?', 'Both UVA and UVB rays.', ['Only visible makeup fallout', 'Only cold weather dryness', 'Only follicle oil'], 'Daily SPF is essential after exfoliation and for pigmentation prevention.', ['sunscreen', 'UV']),
  ],
  'Product Knowledge': [
    topic('cleanser selection', 'Which cleanser is best for dry sensitive skin?', 'A gentle, non-stripping cleanser with low fragrance risk.', ['A harsh degreasing cleanser used repeatedly', 'An abrasive body scrub', 'A high-alcohol toner as cleanser'], 'Cleanser should remove soil without damaging the barrier.', ['cleanser', 'sensitive skin']),
    topic('toner role', 'What is the modern role of toner?', 'To refresh, hydrate, balance, or deliver light ingredients depending on formula.', ['To sterilize open wounds', 'To replace moisturizer forever', 'To diagnose disorders'], 'Toners vary widely and should be chosen by formula and skin need.', ['toner', 'product selection']),
    topic('serum', 'What is a serum?', 'A concentrated treatment product designed to deliver targeted ingredients.', ['A towel disinfectant', 'A type of wax strip', 'A massage movement'], 'Serums are selected for goals such as hydration, brightening, oil balance, or aging support.', ['serum', 'ingredients']),
    topic('moisturizer', 'Why moisturize oily skin?', 'To support barrier balance without necessarily adding heavy oil.', ['Oily skin never needs water', 'Moisturizer disinfects pores', 'It replaces cleansing'], 'Skipping hydration can leave oily skin dehydrated and irritated.', ['moisturizer', 'oily skin']),
    topic('SPF use', 'When should SPF be recommended?', 'Daily during daytime, especially after exfoliation or brightening services.', ['Only after sunburn appears', 'Only at night', 'Only for dry skin types'], 'UV exposure contributes to aging, pigmentation, and skin cancer risk.', ['SPF', 'home care']),
    topic('noncomedogenic', 'What does noncomedogenic mean?', 'Formulated to be less likely to clog pores.', ['Guaranteed to cure acne', 'Sterile after opening', 'Always oil-free and fragrance-free'], 'Noncomedogenic products are often preferred for acne-prone clients but still require observation.', ['noncomedogenic', 'acne']),
    topic('fragrance', 'Why might fragrance be avoided for sensitive clients?', 'It can be a common irritant or allergen.', ['It prevents every breakout', 'It increases disinfectant strength', 'It makes SPF unnecessary'], 'Sensitive and allergy-prone clients often tolerate simpler formulas better.', ['fragrance', 'sensitivity']),
    topic('home care', 'What is a safe way to introduce a new active product?', 'Start slowly, patch test when appropriate, and monitor skin response.', ['Use every active twice daily immediately', 'Layer with a peel the first night', 'Ignore stinging for a week'], 'Gradual introduction reduces irritation and helps identify reactions.', ['home care', 'actives']),
  ],
  'Body Treatments': [
    topic('body exfoliation', 'What is a key safety point for body exfoliation?', 'Avoid broken, sunburned, inflamed, or infected skin.', ['Use maximum pressure everywhere', 'Skip intake because it is not the face', 'Reuse scrub from a previous client'], 'Body services still require consultation, sanitation, and contraindication checks.', ['body treatment', 'exfoliation']),
    topic('body wrap', 'What should be monitored during a body wrap?', 'Comfort, temperature, circulation, breathing, and signs of distress.', ['Only retail preference', 'Wax temperature', 'Mascara transfer'], 'Wraps can become too warm, tight, or uncomfortable and require monitoring.', ['body wrap', 'client safety']),
    topic('back facial', 'Why is skin analysis important before a back facial?', 'The back can have acne, irritation, lesions, or contraindications just like the face.', ['Back skin cannot be analyzed', 'It determines hair color', 'It replaces disinfecting the bed'], 'Body skin requires the same professional judgment as facial skin.', ['back facial', 'analysis']),
    topic('draping', 'What is proper draping for body treatments?', 'Maintain modesty, warmth, and access only to the area being treated.', ['Expose all areas for convenience', 'Use soiled linens', 'Let drapes touch the floor and reuse'], 'Professional draping protects client comfort and hygiene.', ['draping', 'professionalism']),
  ],
  'Professional Practice': [
    topic('scope of practice', 'What does scope of practice mean?', 'The services and actions legally permitted for an esthetician in their jurisdiction.', ['Any service a client requests', 'Only retail sales', 'Medical diagnosis by preference'], 'Staying within scope protects client safety and licensure.', ['scope', 'law']),
    topic('consultation form', 'Why use an intake and consultation form?', 'To document history, goals, medications, allergies, and contraindications.', ['To replace sanitation', 'To guarantee no reaction can happen', 'To avoid speaking with the client'], 'Accurate records support safe service planning and continuity.', ['consultation', 'records']),
    topic('confidentiality', 'How should client information be handled?', 'Keep it private and share only as allowed by policy and law.', ['Discuss it with other clients', 'Post it online without permission', 'Leave forms visible in reception'], 'Professional confidentiality builds trust and protects sensitive information.', ['confidentiality', 'ethics']),
    topic('referral', 'When should an esthetician refer a client?', 'When a condition appears medical, suspicious, contagious, or outside scope.', ['Only when the client buys retail', 'Never, because estheticians diagnose', 'When a room is unavailable'], 'Referral is appropriate when cosmetic services are not safe or sufficient.', ['referral', 'scope']),
    topic('records', 'What should be included in service records?', 'Products used, skin observations, client responses, contraindications, and recommendations.', ['Personal gossip', 'Unlabeled abbreviations only', 'Other clients names'], 'Records support follow-up care and professional accountability.', ['record keeping', 'documentation']),
    topic('professional language', 'How should a provider discuss skin concerns?', 'Use respectful, objective language and avoid diagnosing.', ['Use alarming medical labels', 'Criticize the clients habits', 'Promise cures'], 'Clear professional communication keeps care supportive and within scope.', ['communication', 'ethics']),
  ],
  'State Board Mixed Scenarios': [
    topic('practical setup', 'During practical setup, what should be placed on the clean field?', 'Only disinfected or single-use supplies needed for the service.', ['Used towels from the last service', 'Personal phone and lunch', 'Open sharps without protection'], 'A clean field separates ready-to-use supplies from contaminated items.', ['state board', 'setup']),
    topic('client reports retinol', 'A client mentions nightly retinol after lying down for brow waxing. What is the best response?', 'Pause and reassess whether waxing is safe for that area today.', ['Wax quickly before skin reacts', 'Use hotter wax to reduce pulls', 'Skip the chart note'], 'Medication and active use can change waxing safety and must be screened before service.', ['state board', 'retinol']),
    topic('forgot contact time', 'You sprayed a surface but wiped it dry immediately. What should you do?', 'Reapply disinfectant and allow the full labeled contact time.', ['Assume one wipe is enough', 'Cover the surface with a towel', 'Use the surface only for clean tools'], 'Disinfectant must stay wet for the labeled contact time to be effective.', ['state board', 'disinfection']),
    topic('unknown rash', 'A client shows an unexplained rash on the area to be treated. What should you do?', 'Avoid treating the area and recommend medical evaluation.', ['Diagnose the rash as allergy', 'Apply a peel to test it', 'Massage until redness fades'], 'Unexplained or active skin changes require caution and referral.', ['state board', 'referral']),
    topic('machine contraindication', 'A client with a pacemaker requests microcurrent. What is the safest action?', 'Do not perform the electrical service unless allowed by policy and medical clearance.', ['Use a lower setting without asking', 'Move the electrode faster', 'Only avoid moisturizer'], 'Electrical modalities may be contraindicated with implanted medical devices.', ['state board', 'electricity']),
    topic('wax burn', 'Wax feels too hot and the client pulls away. What should happen first?', 'Stop application and cool the area following first-aid procedures.', ['Apply a second layer to remove the first', 'Tell the client heat is normal', 'Continue on a different area without checking'], 'Client discomfort and possible burns require immediate response.', ['state board', 'waxing']),
    topic('missed answer review', 'A student misses several questions about fungi. What smart review action helps most?', 'Schedule more microbiology and skin disorder cards sooner.', ['Hide all missed cards', 'Study only mastered categories', 'Reset all progress to zero'], 'Spaced repetition should bring weak topics back sooner.', ['study strategy', 'spaced repetition']),
    topic('post peel SPF', 'After a superficial exfoliation service, what instruction matters most for daytime exposure?', 'Use broad-spectrum SPF and limit unnecessary sun exposure.', ['Tan to even the skin', 'Use a scrub that night', 'Skip moisturizer for a week'], 'Freshly exfoliated skin is more vulnerable to UV irritation and pigmentation.', ['state board', 'aftercare']),
    topic('dirty implement tray', 'You notice clean and used implements mixed together. What is correct?', 'Treat the mixed tray as contaminated and reprocess the implements.', ['Use the clean-looking tools', 'Spray perfume on the tray', 'Ask the client which tools were used'], 'When clean status is uncertain, items must be considered contaminated.', ['state board', 'implements']),
    topic('scope request', 'A client asks you to remove a suspicious mole. What should you say?', 'That the concern needs evaluation by a licensed medical provider.', ['Agree if the client signs a waiver', 'Use extraction tools to remove it', 'Apply strong acid to lighten it'], 'Suspicious lesions are outside esthetic scope and need referral.', ['state board', 'scope']),
  ],
};

const stems = [
  'In an exam-style practice question',
  'During a state board practical simulation',
  'At the start of a client service',
  'While reviewing a client intake form',
  'In a treatment room decision point',
  'When choosing the safest next step',
  'During a timed mock exam',
  'When documenting a professional service',
];

const definitionPrompts = [
  'Define',
  'Identify the best description of',
  'Which answer best explains',
  'What should a student remember about',
];

const scenarioActions = [
  'What should the esthetician do first?',
  'Which choice is safest and within scope?',
  'What is the best board-style answer?',
  'Which action protects the client and the professional?',
];

const procedurePrompts = [
  'Which option places the steps in the safest order?',
  'What is the correct sequence for this decision?',
  'Which order best follows board-style procedure?',
];

const rotateDifficulty = (index: number): Difficulty => {
  if (index % 5 === 0) return 'hard';
  if (index % 2 === 0) return 'medium';
  return 'easy';
};

const rotateType = (index: number): QuestionType => {
  const types: QuestionType[] = ['flashcard', 'multiple_choice', 'scenario', 'multiple_choice', 'scenario'];
  return types[index % types.length];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const uniqueChoices = (correct: string, distractors: string[]) => {
  const choices = [correct, ...distractors, ...defaultDistractors].filter(
    (choice, index, list) => choice && list.indexOf(choice) === index,
  );
  return choices.slice(0, 4);
};

const buildOrderQuestion = (category: string, topicItem: Topic, index: number): EstheticsQuestion => {
  const order =
    topicItem.order ??
    ['Screen the client and identify risks', topicItem.answer.replace(/\.$/, ''), 'Document the decision and aftercare'];
  const correct = order.join(' > ');
  const choices = uniqueChoices(correct, [
    [...order].reverse().join(' > '),
    [order[1], order[0], order[2]].join(' > '),
    ['Skip consultation', order[1], 'Document only if irritation occurs'].join(' > '),
  ]);

  return {
    id: `${slugify(category)}-${String(index + 1).padStart(3, '0')}`,
    type: 'multiple_choice',
    category,
    difficulty: rotateDifficulty(index + 1),
    question: `${procedurePrompts[index % procedurePrompts.length]} Focus: ${topicItem.focus}.`,
    answer: correct,
    choices,
    correctAnswer: correct,
    explanation: `${topicItem.explanation} Procedure-order questions reward safe screening, correct technique, and documentation.`,
    tags: [...new Set([...topicItem.tags, 'procedure order'])],
  };
};

const buildQuestion = (category: string, topicItem: Topic, index: number): EstheticsQuestion => {
  if (index % 11 === 7) {
    return buildOrderQuestion(category, topicItem, index);
  }

  const type = rotateType(index);
  const id = `${slugify(category)}-${String(index + 1).padStart(3, '0')}`;
  const difficulty = rotateDifficulty(index);
  const choices = uniqueChoices(topicItem.answer, topicItem.distractors);
  const stem = stems[index % stems.length];
  const definitionPrompt = definitionPrompts[index % definitionPrompts.length];
  const scenarioAction = scenarioActions[index % scenarioActions.length];
  const scenario = topicItem.scenario ?? `${stem}, the topic is ${topicItem.focus}.`;

  const question =
    type === 'flashcard'
      ? `${definitionPrompt} ${topicItem.focus}: ${topicItem.question}`
      : type === 'scenario'
        ? `${scenario} ${scenarioAction}`
        : `${stem}: ${topicItem.question}`;

  return {
    id,
    type,
    category,
    difficulty,
    question,
    answer: topicItem.answer,
    choices,
    correctAnswer: topicItem.answer,
    explanation: topicItem.explanation,
    tags: topicItem.tags,
  };
};

const generateCategoryQuestions = (category: string, count: number): EstheticsQuestion[] => {
  const topics = topicsByCategory[category];
  if (!topics?.length) return [];

  return Array.from({ length: count }, (_, index) => {
    const topicItem = topics[index % topics.length];
    return buildQuestion(category, topicItem, index);
  });
};

export const estheticsQuestionBank: EstheticsQuestion[] = Object.entries(categoryCounts).flatMap(([category, count]) =>
  generateCategoryQuestions(category, count),
);

export const questionBankStats = {
  total: estheticsQuestionBank.length,
  byCategory: categoryCounts,
};
