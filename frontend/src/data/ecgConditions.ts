export interface EcgCondition {
  name: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  details: string[];
  description?: string;
  treatment?: string[];
}
export const ecgConditions: EcgCondition[] = [
  {
    name: 'Normal Sinus Rhythm',
    confidence: 92,
    risk: 'low',
    details: [
      'Normal P waves preceding each QRS complex',
      'Regular RR intervals (60-100 bpm)',
      'Normal QRS duration (0.08-0.10 seconds)',
      'No significant ST segment abnormalities'
    ],
    description: 'A normal heart rhythm originating from the sinus node, the heart\'s natural pacemaker.',
    treatment: [
      'No specific treatment required',
      'Regular health check-ups recommended',
      'Maintain heart-healthy lifestyle'
    ]
  },
  {
    name: 'Sinus Bradycardia',
    confidence: 90,
    risk: 'low',
    details: [
      'Normal P waves preceding each QRS complex',
      'Regular but slow rhythm (<60 bpm)',
      'Normal PR interval and QRS duration',
      'Common in athletes and during sleep'
    ],
    description: 'A slower than normal heart rate originating from the sinus node.',
    treatment: [
      'Often no treatment needed if asymptomatic',
      'Evaluate and treat underlying causes if present',
      'Pacemaker may be considered in symptomatic cases'
    ]
  },
  {
    name: 'Atrial Fibrillation',
    confidence: 88,
    risk: 'medium',
    details: [
      'Irregular RR intervals',
      'Absence of distinct P waves',
      'Presence of fibrillatory waves',
      'Moderate risk of blood clots and stroke'
    ],
    description: 'An irregular heart rhythm characterized by rapid and disorganized electrical signals in the atria.',
    treatment: [
      'Rate control medications (beta-blockers, calcium channel blockers)',
      'Rhythm control medications or cardioversion',
      'Anticoagulation therapy to prevent stroke',
      'Catheter ablation for persistent cases'
    ]
  },
  {
    name: 'Myocardial Infarction',
    confidence: 78,
    risk: 'high',
    details: [
      'ST segment elevation > 1mm in multiple leads',
      'Pathological Q waves observed',
      'T wave inversions in affected leads',
      'Reciprocal ST depression in opposite leads'
    ],
    description: 'Heart attack caused by blocked blood flow to heart muscle, resulting in tissue damage.',
    treatment: [
      'Immediate reperfusion therapy (PCI or thrombolytics)',
      'Antiplatelet therapy (aspirin, P2Y12 inhibitors)',
      'Beta-blockers, ACE inhibitors, statins',
      'Cardiac rehabilitation program'
    ]
  },
  {
    name: 'Left Bundle Branch Block',
    confidence: 86,
    risk: 'medium',
    details: [
      'Wide QRS complex (>0.12 seconds)',
      'Absence of Q waves in leads I, V5, and V6',
      'Slurred, notched R waves in leads I, aVL, V5, V6',
      'ST and T wave abnormalities'
    ],
    description: 'A conduction delay or block in the left bundle branch of the heart\'s electrical system.',
    treatment: [
      'Treatment of underlying heart disease',
      'Cardiac resynchronization therapy in eligible patients',
      'Regular monitoring of cardiac function',
      'Management of heart failure if present'
    ]
  },
  {
    name: 'Ventricular Tachycardia',
    confidence: 82,
    risk: 'high',
    details: [
      'Wide QRS complexes (>0.12 seconds)',
      'Heart rate typically >100 bpm',
      'AV dissociation possible',
      'Requires immediate medical attention'
    ],
    description: 'A fast heart rhythm that originates in the ventricles and can be life-threatening.',
    treatment: [
      'Immediate cardioversion for unstable patients',
      'Antiarrhythmic medications (amiodarone, lidocaine)',
      'ICD implantation for prevention',
      'Catheter ablation for recurrent episodes'
    ]
  }
];
export const getRandomEcgCondition = (): EcgCondition => {
  const randomIndex = Math.floor(Math.random() * ecgConditions.length);
  return {...ecgConditions[randomIndex]};
};
export const getEcgConditionByName = (name: string): EcgCondition | undefined => {
  return ecgConditions.find(condition => condition.name === name);
};