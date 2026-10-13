/**
 * Static dataset registry (source of truth for the Skin Detector backend).
 * Mirrors the DatasetEntry shape from the frontend catalog.
 *
 * @typedef {'skin_tone'|'skin_spectra'|'dermatology'|'albinism'|'mixed'} DatasetType
 * @typedef {'open'|'request'|'restricted'|'huggingface'|'kaggle'} DatasetAccess
 *
 * @typedef {Object} DatasetEntry
 * @property {string} id
 * @property {string} name
 * @property {DatasetType} type
 * @property {string} scale
 * @property {number|string} size
 * @property {DatasetAccess} access
 * @property {string} url
 * @property {string} [doi]
 * @property {string} license
 * @property {string} [notes]
 */

/** @type {DatasetEntry[]} */
export const DATASETS = [
  {
    id: "stw",
    name: "Skin Tone in the Wild",
    type: "skin_tone",
    scale: "Monk Skin Tone (MST)",
    size: 42313,
    access: "open",
    url: "https://arxiv.org/abs/2603.02475",
    license: "Open-access",
    notes: "Largest open MST-labeled dataset; data available soon",
  },
  {
    id: "trueskin",
    name: "TrueSkin",
    type: "skin_tone",
    scale: "6-class (Dark → Pale)",
    size: 7299,
    access: "open",
    url: "https://www.emergentmind.com/topics/trueskin",
    license: "Research",
    notes: "Balanced classes for tone classification benchmarks",
  },
  {
    id: "issa",
    name: "International Skin Spectra Archive",
    type: "skin_spectra",
    scale: "CIE colorimetric + spectral",
    size: 15256,
    access: "open",
    url: "https://doi.org/10.6084/m9.figshare.28228571.v4",
    doi: "10.6084/m9.figshare.28228571.v4",
    license: "Figshare (open)",
    notes: "Spectral reflectance data, not images; 2,113 subjects",
  },
  {
    id: "mskcc",
    name: "MSKCC Skin Tone Labeling",
    type: "skin_tone",
    scale: "Fitzpatrick + Monk + Pantone",
    size: 4879,
    access: "open",
    url: "https://api.isic-archive.com/collections/413/",
    doi: "10.34970/962049",
    license: "CC-BY-NC",
    notes: "Balanced Fitzpatrick I–VI; 64 patients, 1,257 lesions [citation:20]",
  },
  {
    id: "scin",
    name: "Skin Condition Image Network",
    type: "mixed",
    scale: "Fitzpatrick (eFST) + Monk (eMST)",
    size: 10408,
    access: "huggingface",
    url: "https://github.com/google-research-datasets/scin",
    license: "SCIN Data Use License",
    notes: "Crowdsourced; HF mirror: 6,517 images, 3,061 cases [citation:8]",
  },
  {
    id: "fitzpatrick17k",
    name: "Fitzpatrick17k",
    type: "skin_tone",
    scale: "Fitzpatrick I–VI",
    size: 16577,
    access: "open",
    url: "https://github.com/mattgroh/fitzpatrick17k",
    license: "CC BY-NC-SA 3.0",
    notes: "Some image URLs broken; request form available [citation:1]",
  },
  {
    id: "africanized_skin",
    name: "Africanized Skin Cancer",
    type: "mixed",
    scale: "Fitzpatrick (provisional)",
    size: 10015,
    access: "huggingface",
    url: "https://huggingface.co/datasets/Sakhawat077/Africa-skin-cancer-images-EHR",
    license: "CC-BY-NC-4.0",
    notes: "Extends HAM10000 with African EHR data",
  },
  {
    id: "chiasm",
    name: "CHIASM (Albinism MRI)",
    type: "albinism",
    scale: "MRI (T1, DW, fMRI)",
    size: "N/A",
    access: "open",
    url: "https://brainlife.io",
    license: "Research",
    notes: "Brain imaging for albinism/achiasma, not skin color [citation:15]",
  },
  {
    id: "retinal_albinism",
    name: "Retinal Contributions to Vision Loss in Albinism",
    type: "albinism",
    scale: "Phenotype + pedigree",
    size: "N/A",
    access: "request",
    url: "https://ftp.ncbi.nlm.nih.gov/dbgap/studies/phs003573/",
    license: "dbGaP controlled access",
    notes: "NCBI dbGaP study phs003573; requires approval [citation:7]",
  },
  {
    id: "milk10k",
    name: "MILK10k",
    type: "mixed",
    scale: "6-level tone (0–5, non-Fitzpatrick)",
    size: 10480,
    access: "open",
    url: "https://doi.org/10.7910/DVN/FSXRAQ",
    doi: "10.7910/DVN/FSXRAQ",
    license: "CC-BY-NC",
    notes: "Paired clinical + dermatoscopic images; 5,240 lesions [citation:22]",
  },
];
