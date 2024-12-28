// src/data/testData.js
export const testCategories = {
    serologyTests: {
        routineTests: {
            asoTiter: {
                name: "ASO Titer",
                selected: false,
                normalRange: "Up to 200 IU/ml",
                result: null
            },
            rf: {
                name: "RF",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            vdrl: {
                name: "VDRL",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            tpha: {
                name: "TPHA",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            toxoplasmaLatex: {
                name: "Toxoplasma (Latex)",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            paulBunnelTest: {
                name: "Paul Bunnel Test",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            brucella: {
                abortus: {
                    name: "Brucella - Abortus",
                    selected: false,
                    normalRange: "Negative",
                    result: null
                },
                melitensis: {
                    name: "Brucella - Melitensis",
                    selected: false,
                    normalRange: "Negative",
                    result: null
                }
            },
            widalTest: {
                name: "Widal Test",
                salmonellaTyphi: {
                    aH: {
                        name: "Salmonella Typhi A-H",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    },
                    aO: {
                        name: "Salmonella Typhi A-O",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    }
                },
                salmonellaParatyphi: {
                    bH: {
                        name: "Salmonella Paratyphi B-H",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    },
                    bO: {
                        name: "Salmonella Paratyphi B-O",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    },
                    cH: {
                        name: "Salmonella Paratyphi C-H",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    },
                    cO: {
                        name: "Salmonella Paratyphi C-O",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    },
                    dH: {
                        name: "Salmonella Paratyphi D-H",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    },
                    dO: {
                        name: "Salmonella Paratyphi D-O",
                        selected: false,
                        normalRange: "Up to 1:80",
                        result: null
                    }
                }
            }
        }
    },
    elisaTests: {
        hepatitisMarkers: {
            hbsAg: {
                name: "HBsAg",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            antiHBs: {
                name: "Anti HBs",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            antiHBc: {
                name: "Anti HBc",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            hbeAg: {
                name: "HBeAg",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            antiHBe: {
                name: "Anti HBe",
                selected: false,
                normalRange: "Negative",
                result: null
            }
        },
        viralMarkers: {
            havAb: {
                name: "HAV Ab",
                igm: {
                    name: "HAV Ab - IgM",
                    selected: false,
                    normalRange: "Negative",
                    result: null
                },
                igg: {
                    name: "HAV Ab - IgG",
                    selected: false,
                    normalRange: "Negative",
                    result: null
                }
            },
            toxoplasmaAb: {
                name: "Toxoplasma Ab",
                igm: {
                    name: "Toxoplasma Ab - IgM",
                    selected: false,
                    normalRange: "Negative",
                    result: null
                },
                igg: {
                    name: "Toxoplasma Ab - IgG",
                    selected: false,
                    normalRange: "Negative",
                    result: null
                }
            },
            hcv: {
                name: "HCV",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            hiv: {
                name: "HIV",
                selected: false,
                normalRange: "Non reactive",
                result: null
            }
        }
    },
    ihaTests: {
        parasites: {
            bilharzia: {
                name: "Bilharzia",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            echinococcus: {
                name: "Echinococcus",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            amoeba: {
                name: "Amoeba",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            leishmania: {
                name: "Leishmania",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            toxoplasma: {
                name: "Toxoplasma",
                selected: false,
                normalRange: "Negative",
                result: null
            }
        }
    },
    ifaTests: {
        autoimmune: {
            ana: {
                name: "ANA",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            antiDNA: {
                name: "Anti n DNA",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            ama: {
                name: "AMA",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            asma: {
                name: "ASMA",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            apca: {
                name: "APCA",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            ftaAbs: {
                name: "FTA-ABS",
                selected: false,
                normalRange: "Negative",
                result: null
            }
        },
        thyroidAutoantibodies: {
            antiMicrosomal: {
                name: "Anti-microsomal (M)",
                selected: false,
                normalRange: "Negative",
                result: null
            },
            antiThyroglobulin: {
                name: "Anti-Thyoglobulin (T)",
                selected: false,
                normalRange: "Negative",
                result: null
            }
        }
    }
};