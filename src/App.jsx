import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Settings, Search, LayoutGrid, Users, Camera, Send, ChevronDown, ChevronLeft, Paperclip, Image as ImageIcon, X, Sparkles, ArrowRight, RotateCcw, Box, Lightbulb, Smartphone, ScanFace, Wand2, Eye, ShoppingCart, Trash2, Plus, AlertCircle, Home, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// --- CONSTANTS & DATA ---
const HERO_IMAGE_URL = 'https://media-assets.ad-italia.it/photos/62961f20d6ddf64fbea62381/master/w_1600%2Cc_limit/The%2520stairs%2520with%2520the%2520bar_01.jpg';

const STANDARD_KEYWORDS = [
    'bianco', 'grigio', 'nero', 'beige', 'tortora', 'avorio', 'crema',
    'laminato', 'nobilitato', 'laccato opaco', 'rovere', 'frassino', 'legno', 'acciaio'
];

const EXTRA_COST = 300.00;

// --- CONFIGURAZIONE API ---
// L'API key viene fornita dall'ambiente Canvas in fase di runtime.
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;


// MODELLI GOOGLE CORRETTI E STABILI
// FIX 503: Usiamo il modello preview specifico che è garantito in questo ambiente
const GEMINI_TEXT_MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";
// FIX: Modello ottimizzato per manipolazione immagini
const GEMINI_IMAGE_EDIT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=";

const teamMembers = [
    { 
        id: 1, 
        name: "Leonardo D'Errico", 
        role: "CEO & Founder", 
        image: "https://lh3.googleusercontent.com/d/1q5P3LF6J5ILaZePZhnApI0pZFAW13ZQk"
    },
    { 
        id: 2, 
        name: "Samuele Ascenzi", 
        role: "Creative Director", 
        image: "https://lh3.googleusercontent.com/d/1JkJjAij3VE5DGKfLOn9i2bNnG-7cXrLt" 
    },
    { 
        id: 3, 
        name: "Samuele Duradoni", 
        role: "AI Lead Developer", 
        image: "https://lh3.googleusercontent.com/d/1nRZv6XyVcAF74aNOcPIyYtbwjBNZjecO" 
    },
    {    
        id: 4, name: "Costanza Del Bono", 
        role: "Interior Architect", 
        image: "https://lh3.googleusercontent.com/d/1TioeBhOHht3n6_4-8nRpwzrRD5q3GeBF" 
    },
    { 
        id: 5, 
        name: "Marwan Ouda", 
        role: "Product Manager", 
        image: "https://lh3.googleusercontent.com/d/1WjD_P1_6TvEiFLgiZm9u8hdhPpTzLcdI" 
    },
];

const categories = [
    'Tutti',
    'Cucine',
    'Cucine Outdoor', 
    'Bagni',
    'Living',
    'Cabine Armadio',
    'Tavoli',
];

const catalogItems = [
    {
        id: 101,
        title: "Cucina Natural",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 15800.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/01/Rovere-Miele-Anta-Liscia2-scaled.jpg",
        description: "Prodotto da Stosa Cucine. Evolution System. Il calore del Rovere con doghe verticali per una naturalezza autentica e moderna.",
        initial_material: "Rovere Dogato",
        initial_color: "Legno Miele",
        tipologia: "CUCINA"
    },
    {
        id: 102,
        title: "Cucina Metropolis",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 16500.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2021/12/Metropolis-Gallery-4.jpg",
        description: "Prodotto da Stosa Cucine. Stile eclettico che unisce materiali tecnici come il PET e il Fenix a finiture materiche.",
        initial_material: "PET e Fenix",
        initial_color: "Grigio chiaro",
        tipologia: "CUCINA"
    },
    {
        id: 103,
        title: "Cucina Aliant",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 19200.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/01/01.-Finitura-Bronzo-per-gole-e-zoccoli.jpg",
        description: "Prodotto da Stosa Cucine. Il pregio del vetro. Riflessi di luce e profondità per una cucina dal design puro ed essenziale.",
        initial_material: "Vetro",
        initial_color: "Nero",
        tipologia: "CUCINA"
    },
    {
        id: 104,
        title: "Cucina Color Trend",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 13500.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/02/Color-Trend-Gallery-5.jpg",
        description: "Prodotto da Stosa Cucine. Massima libertà espressiva con ante laccate disponibili in una vasta gamma di colori.",
        initial_material: "Laccato Lucido",
        initial_color: "Beige chiaro",
        tipologia: "CUCINA"
    },
    {
        id: 105,
        title: "Cucina Karma",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 14200.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/02/Gallery-Karma-3.jpg",
        description: "Prodotto da Stosa Cucine. Look System. L'anta liscia essenziale valorizzata da materiali materici e presa maniglia integrata.",
        initial_material: "Rovere Materico",
        initial_color: "Giallo ocra e marrone scuro",
        tipologia: "CUCINA"
    },
    {
        id: 106,
        title: "Cucina City",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 12900.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/01/CITY-02-VISTA-03-scaled.jpg",
        description: "Prodotto da Stosa Cucine. Ispirazione vintage e industrial. Dettagli in metallo e legno per uno stile metropolitano deciso.",
        initial_material: "Legno e Metallo",
        initial_color: "Grigio",
        tipologia: "CUCINA"
    },
    {
        id: 107,
        title: "Cucina Infinity",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 11800.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/01/Gallery-Infinity-1.jpg",
        description: "Prodotto da Stosa Cucine. Versatile e giovane. Soluzioni creative con materiali innovativi come PET e Fenix.",
        initial_material: "PET",
        initial_color: "Bronze Metal",
        tipologia: "CUCINA"
    },
    {
        id: 108,
        title: "Cucina Alevé",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 10500.00,
        imageUrl: "https://stosa-cucine.it/wp-content/uploads/2020/10/Aleve_2.jpg",
        description: "Prodotto da Stosa Cucine. Il lusso accessibile. Design pulito e funzionale, perfetto per ambienti urbani.",
        initial_material: "Laccato UV",
        initial_color: "Grigio Ardesia",
        tipologia: "CUCINA"
    },
    {
        id: 109,
        title: "Cucina Newport",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 17500.00,
        imageUrl: "https://www.stosapointroma.com/wp-content/uploads/2025/09/stosa-cucine-roma-newport-15.jpeg",
        description: "Prodotto da Stosa Cucine. Classic Glam. Un'anta a telaio contemporanea che reinterpreta lo stile internazionale.",
        initial_material: "Frassino",
        initial_color: "Nero e legno",
        tipologia: "CUCINA"
    },
    {
        id: 110,
        title: "Cucina Tosca",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 18900.00,
        imageUrl: "https://stosacucine.store/wp-content/uploads/2023/02/TOSCA-2023-ok-4-2560x800.jpg",
        description: "Prodotto da Stosa Cucine. L'eleganza del legno di Frassino. Dettagli raffinati e doghe per uno stile classico senza tempo.",
        initial_material: "Frassino",
        initial_color: "Bianco",
        tipologia: "CUCINA"
    },
    {
        id: 111,
        title: "Cucina Beverly",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 16200.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/02/Beverly-gallery-05.jpg",
        description: "Prodotto da Stosa Cucine. Versatilità stilistica. Un classico leggero che gioca con i contrasti di colore e volume.",
        initial_material: "Legno Frassino",
        initial_color: "Verde chiaro",
        tipologia: "CUCINA"
    },
    {
        id: 112,
        title: "Cucina York",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 15500.00,
        imageUrl: "https://www.piermarini.it/images/thumb/thumb_1569594078.jpg",
        description: "Prodotto da Stosa Cucine. Lo stile garage incontra il classico. Anta dogata in rovere per un look loft sofisticato.",
        initial_material: "Rovere",
        initial_color: "Rovere Naturale",
        tipologia: "CUCINA"
    },
    {
        id: 113,
        title: "Cucina Bolgheri",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 14800.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/02/Gallery-01-3.jpg",
        description: "Prodotto da Stosa Cucine. Il calore della tradizione. Linee morbide e colori pastello per una cucina accogliente.",
        initial_material: "Legno Laccato",
        initial_color: "Bianco Panna",
        tipologia: "CUCINA"
    },
    {
        id: 114,
        title: "Cucina Virginia",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 17200.00,
        imageUrl: "https://ronchisrl.com/wp-content/uploads/2021/12/2-7.jpg",
        description: "Prodotto da Stosa Cucine. Atmosfere country chic. Anta piena in frassino e dettagli floreali per un romanticismo moderno.",
        initial_material: "Frassino",
        initial_color: "Verde Salvia",
        tipologia: "CUCINA"
    },
    {
        id: 115,
        title: "Cucina Dolcevita",
        brand: "Stosa Cucine",
        category: 'Cucine',
        price: 21000.00,
        imageUrl: "https://www.stosacucine.com/app/uploads/2022/02/Gallery-02-5.jpg",
        description: "Prodotto da Stosa Cucine. Il lusso del classico italiano. Cornici intagliate e laccature preziose per una cucina regale.",
        initial_material: "Laccato Opaco",
        initial_color: "Beige chiaro",
        tipologia: "CUCINA"
    },
    { 
        id: 1, 
        title: "Cucina Jeometrica", 
        brand: "Scavolini", 
        category: 'Cucine', 
        price: 14500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/1f022ad9-69d4-491d-83cc-3a236f090ebf/nuctwf/std/900x0/Jeometrica_pag_8.jpg",
        description: "Prodotto da Scavolini. Design by Luca Nichetto. Un sistema d'arredo evolutivo che unisce memoria e modernità.",
        initial_material: "Laccato Opaco",
        initial_color: "Grigio Antracite e panna",
        tipologia: "CUCINA"
    },
    { 
        id: 2, 
        title: "Diesel Get Together", 
        brand: "Scavolini", 
        category: 'Cucine', 
        price: 18200.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/ddb3c284-e605-4eab-acb3-99b4bfdda24f/nuctwf/std/1400x0/Diesel%20Get%20Together_pag_22.jpg",
        description: "Prodotto da Scavolini. Design by Diesel Creative Team. La cucina come luogo sociale, mix industrial.",
        initial_material: "Metallo e Legno",
        initial_color: "Legno chiaro",
        tipologia: "CUCINA"
    },
    { 
        id: 7, 
        title: "Cucina Carattere", 
        brand: "Scavolini", 
        category: 'Cucine', 
        price: 16800.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/b2696864-16cf-46e4-98a1-e49945fd82d6/nuctwf/std/900x0/Carattere_Restyling_I_copertina.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. Eleganza internazionale dal gusto classico-contemporaneo.",
        initial_material: "Laccato Opaco",
        initial_color: "Bianco Lucido",
        tipologia: "CUCINA"
    },
    { 
        id: 8, 
        title: "Mia by Carlo Cracco", 
        brand: "Scavolini", 
        category: 'Cucine', 
        price: 22500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/353020e7-ee4f-4726-b9a7-fc186dc3e440/nuctwf/std/900x0/Mia_I_copertina.jpg",
        description: "Prodotto da Scavolini. L'interpretazione domestica della cucina professionale.",
        initial_material: "Acciaio",
        initial_color: "Nero",
        tipologia: "CUCINA"
    },
    { 
        id: 9, 
        title: "Cucina Lumina", 
        brand: "Scavolini", 
        category: 'Cucine', 
        price: 13900.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/0c9e6c85-0de7-44f8-a984-0851c931b068/nuctwf/std/900x0/Lumina_prev_pag_8.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. Linee pulite e presa maniglia a 40°.",
        initial_material: "Vetro Dogato",
        initial_color: "Grigio",
        tipologia: "CUCINA"
    },
    { 
        id: 10, 
        title: "Cucina Baltimora", 
        brand: "Scavolini", 
        category: 'Cucine', 
        price: 19500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/4d84e4f3-d18e-42f4-87ad-95e4f1a3e740/nuctwf/std/900x0/Baltimora_pag_40.jpg",
        description: "Prodotto da Scavolini. Il classico di lusso. Legno massello e dettagli preziosi.",
        initial_material: "Frassino Massello",
        initial_color: "Grigio chiaro",
        tipologia: "CUCINA"
    },
    { 
        id: 11, 
        title: "Cucina Libra", 
        brand: "Scavolini", 
        category: 'Cucine', 
        price: 15200.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/889f1358-b494-488a-bfc7-6b4272d57a6d/nuctwf/std/900x0/Libra_prev_pag_2.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. Armonia di superfici lisce e dogate.",
        initial_material: "Laminato",
        initial_color: "Beige chiaro",
        tipologia: "CUCINA"
    },
    { 
        id: 12, 
        title: "Formalia Outdoor", 
        brand: "Scavolini", 
        category: 'Cucine Outdoor', 
        price: 11500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/38e855c9-602c-473e-bc89-53bcbc3d77df/nuctwf/std/1920x0/Formalia_Outdoor_pag_24-25.jpg",
        description: "Prodotto da Scavolini. Design Vittore Niolu. La cucina esce all'aperto, resistente e di design.",
        initial_material: "Acciaio Inox",
        initial_color: "Grigio",
        tipologia: "CUCINA ESTERNA"
    },
    { 
        id: 3, 
        title: "Bagno Miko", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 3400.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/b967aa81-dc5b-4e34-8bf2-9e40c67d2a53/nuctwf/std/900x0/MIKO_pag_12.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. L'essenza del minimalismo con attenzione ai materiali ricercati.",
        initial_material: "Laccato Opaco",
        initial_color: "Beige",
        tipologia: "BAGNO"
    },
    { 
        id: 13, 
        title: "Bagno Gym Space", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 4200.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/c375ee6d-7b31-45bd-b8e2-33e0c715096d/nuctwf/std/1400x0/Gym%20Space_pag_108.jpg",
        description: "Prodotto da Scavolini. Design Mattia Pareschi. Il bagno incontra il fitness con spalliera integrata.",
        initial_material: "Legno Chiaro",
        initial_color: "Verde",
        tipologia: "BAGNO"
    },
    { 
        id: 14, 
        title: "Bagno Lido", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 2900.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/97fe5c33-483e-43a8-bdf5-b2ca510d20cc/nuctwf/std/900x0/LIDO_pag_20.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. Anta squadrata e gola arrotondata. Finiture perlate.",
        initial_material: "Laccato Perlato",
        initial_color: "Verde acqua",
        tipologia: "BAGNO"
    },
    { 
        id: 18, 
        title: "Diesel Misfits Bathroom", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 5500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/5a5b042f-cde0-47b9-aee2-975bec307a6d/nuctwf/std/1920x0/DIESEL-MISFITS-BATH_pag_10-11.jpg?scalemode=manual&cropmode=pixel&adjustcrop=extend&cropx=-1&cropy=1162&cropw=4065&croph=1161",
        description: "Prodotto da Scavolini. Design Diesel Living. Ispirato ai carrelli industriali 'Misfits'.",
        initial_material: "Metallo e Vetro",
        initial_color: "Nero Opaco",
        tipologia: "BAGNO"
    },
    { 
        id: 19, 
        title: "Bagno Rivo", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 3100.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/60180d35-a003-474c-9860-b1bf7c5694f1/nuctwf/std/900x0/RIVO_pag_34.jpg",
        description: "Prodotto da Scavolini. Design Castiglia Associati. Design essenziale con gola inclinata a 45 gradi.",
        initial_material: "Laccato Lucido",
        initial_color: "Bianco Lucido",
        tipologia: "BAGNO"
    },
    { 
        id: 20, 
        title: "Diesel Open Workshop", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 6200.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/55b35533-9fe2-40d6-9aeb-fbed72466263/nuctwf/std/1400x0/Diesel%20Open%20Workshop_BATH_pag_3.jpg",
        description: "Prodotto da Scavolini. Design Diesel Creative Team. Stile 'Warm Industrial'.",
        initial_material: "Metallo e Legno",
        initial_color: "Nero",
        tipologia: "BAGNO"
    },
    { 
        id: 21, 
        title: "Bagno Tratto", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 3600.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/7490c931-69d6-4725-8ed6-1b803778e160/nuctwf/std/900x0/Tratto_pag_12.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. L'anta con profilo maniglia integrato disegna una linea continua.",
        initial_material: "Rovere",
        initial_color: "Bianco",
        tipologia: "BAGNO"
    },
    { 
        id: 22, 
        title: "Bagno Juno", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 2800.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/b6916e7b-8a71-4a6d-ad59-5b5485859281/nuctwf/std/900x0/Juno_pag_57.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. Linee geometriche e anta con presa maniglia a 'J'.",
        initial_material: "Laccato Opaco",
        initial_color: "Bianco",
        tipologia: "BAGNO"
    },
    { 
        id: 23, 
        title: "Bagno Magnifica", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 7500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/90acb881-4a10-4309-8b92-ca71fe5eaff5/nuctwf/std/900x0/Magnifica_pag_61.jpg",
        description: "Prodotto da Scavolini. Design Gianni Pareschi. Un classico contemporaneo d'eccellenza.",
        initial_material: "Laccato Lucido",
        initial_color: "Crema e Oro",
        tipologia: "BAGNO"
    },
    { 
        id: 24, 
        title: "Bagno Lagu", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 3300.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/0828951f-bdd4-4a37-b2b7-91af8dbfd930/nuctwf/std/900x0/Lagu_pag_42.jpg",
        description: "Prodotto da Scavolini. Design Castiglia Associati. Anta con taglio inclinato.",
        initial_material: "Laccato Lucido",
        initial_color: "Bianco",
        tipologia: "BAGNO"
    },
    { 
        id: 25, 
        title: "Bagno Idro", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 2100.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/d7eb090a-3b71-4c80-add1-9d0a64993d45/nuctwf/std/900x0/Idro_pag_22.jpg",
        description: "Prodotto da Scavolini. Design Castiglia Associati. Soluzione ideale per l'ambiente lavanderia elegante.",
        initial_material: "Nobilitato",
        initial_color: "Bianco",
        tipologia: "LAVANDERIA"
    },
    { 
        id: 26, 
        title: "Bagno Dandy Plus", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 2750.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/847cca2d-8eac-4abd-994a-dfdca95f1886/nuctwf/std/900x0/Dandy_Plus_Bath_pag_13.jpg",
        description: "Prodotto da Scavolini. Design Novembre Studio. Pop e tecnologico con Task Bar integrata.",
        initial_material: "Laminato",
        initial_color: "Bianco",
        tipologia: "BAGNO"
    },
    { 
        id: 27, 
        title: "Formalia Bagno", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 4500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/2fd523a7-02cc-461a-99c4-80eb76ac44c8/nuctwf/std/1400x0/Formalia%20Bath_pag_22.jpg",
        description: "Prodotto da Scavolini. Design Vittore Niolu. Estensione del sistema cucina con Sistema Parete Status.",
        initial_material: "Decorativo",
        initial_color: "Bronzo",
        tipologia: "BAGNO"
    },
    { 
        id: 28, 
        title: "Bagno Aquo", 
        brand: "Scavolini", 
        category: 'Bagni', 
        price: 3200.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/8881c70d-baf5-4a1b-bdd5-1f274c00523e/nuctwf/std/900x0/AQUO_pag_22_23.jpg",
        description: "Prodotto da Scavolini. Design Castiglia Associati. Estetica contemporanea e minimale.",
        initial_material: "Laccato",
        initial_color: "Beige scuro",
        tipologia: "BAGNO"
    },
    { 
        id: 4, 
        title: "Sistema Parete Fluida", 
        brand: "Scavolini", 
        category: 'Living', 
        price: 4800.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/a1e9a590-b7cd-41de-9b9d-4c9b803a63f0/nuctwf/std/800x0/Motus%202022_pag_51.jpg",
        description: "Prodotto da Scavolini. Sistema modulare versatile che estende l'estetica della cucina al living.",
        initial_material: "Decorativo",
        initial_color: "Blu chiaro",
        tipologia: "LIVING"
    },
    { 
        id: 15, 
        title: "Madia Sideboard EveryTime", 
        brand: "Scavolini", 
        category: 'Living', 
        price: 1850.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/3b82f6ea-f059-4826-b5b7-58fe5be7859c/nuctwf/std/900x0/08_SIDEBOARD_NET_PAG_17.jpg",
        description: "Prodotto da Scavolini. Versatilità per arredare la tua casa. Madie eleganti.",
        initial_material: "Laccato Lucido",
        initial_color: "Grigio",
        tipologia: "MADIA"
    },
    { 
        id: 16, 
        title: "Sistema Parete Status", 
        brand: "Scavolini", 
        category: 'Living', 
        price: 3600.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/b5104044-3c44-4377-bb45-018333d4f901/nuctwf/std/1400x0/Formalia_pag_43.jpg",
        description: "Prodotto da Scavolini. Il sistema giorno aperto e flessibile. Struttura a giorno.",
        initial_material: "Metallo",
        initial_color: "Beige metallizzato",
        tipologia: "LIVING"
    },
    { 
        id: 5, 
        title: "Walk-in Fluida Comfort", 
        brand: "Scavolini", 
        category: 'Cabine Armadio', 
        price: 5900.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/8f4e110f-e206-401b-b189-5b46e0443375/nuctwf/std/900x0/Walk-in-Fluida_pag_36-37.jpg",
        description: "Prodotto da Scavolini. Design Vuesse. Organizzazione perfetta dei volumi in un design curato.",
        initial_material: "Noce Garden",
        initial_color: "Nero",
        tipologia: "GUARDAROBA"
    },
    {
        id: 29,
        title: "Walk-in Fluida Lineare",
        brand: "Scavolini",
        category: 'Cabine Armadio',
        price: 4500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/c5d79edb-52f4-4936-96e1-4178b2ceaaf0/nuctwf/std/900x0/Walk-in-Fluida_pag_24-25.jpg",
        description: "Prodotto da Scavolini. Composizione lineare con ante laccato opaco Bianco Prestige. Eleganza essenziale.",
        initial_material: "Laccato Opaco",
        initial_color: "Nero",
        tipologia: "GUARDAROBA"
    },
    {
        id: 30,
        title: "Walk-in Fluida Angolare",
        brand: "Scavolini",
        category: 'Cabine Armadio',
        price: 6800.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/5a1fe2de-91e0-44ce-8fc4-80a911ecaa76/nuctwf/std/0x0/Walk-in-Fluida_pag_22-23.jpg?scalemode=manual&cropmode=pixel&adjustcrop=extend&cropx=-3&cropy=445&cropw=4074&croph=1164",
        description: "Prodotto da Scavolini. Soluzione ad angolo con ante laccato opaco Grigio Titanio e ante telaio Acciaio Scuro.",
        initial_material: "Laccato e Vetro",
        initial_color: "Nero",
        tipologia: "GUARDAROBA"
    },
    {
        id: 31,
        title: "Walk-in Fluida Pelle",
        brand: "Scavolini",
        category: 'Cabine Armadio',
        price: 8200.00, 
        imageUrl: "https://immagini.designbest.com/pictures/product-105640-95608.jpg?tr=h-600",
        description: "Prodotto da Scavolini. Il lusso della pelle. Ante in pelle Grigio Perla abbinate a telai Grigio Antracite.",
        initial_material: "Pelle",
        initial_color: "Nero e beige",
        tipologia: "GUARDAROBA"
    },
    {
        id: 32,
        title: "Walk-in Fluida Golfo",
        brand: "Scavolini",
        category: 'Cabine Armadio',
        price: 9500.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/332a63f0-57eb-45cb-916f-6a22bc2697fd/nuctwf/std/1920x0/Walk-in-Fluida_pag_34-35.jpg?scalemode=manual&cropmode=pixel&adjustcrop=extend&cropx=1&cropy=603&cropw=4095&croph=1170",
        description: "Prodotto da Scavolini. Composizione a golfo (U-shaped) con ante telaio Acciaio Scuro e vetro Stopsol.",
        initial_material: "Vetro Stopsol",
        initial_color: "Beige",
        tipologia: "GUARDAROBA"
    },
    {
        id: 33,
        title: "Walk-in Fluida Rovere",
        brand: "Scavolini",
        category: 'Cabine Armadio',
        price: 5200.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/6d7a82a2-ab01-4dbd-93d4-c73af5c32e10/ibvpzo/std/960x0/picture.jpg?format=WEBP",
        description: "Prodotto da Scavolini. Calore naturale. Ante in impiallacciato Rovere Carbone con dettagli in Grigio Antracite.",
        initial_material: "Rovere Carbone",
        initial_color: "Bianco",
        tipologia: "GUARDAROBA"
    },
    {
        id: 37,
        title: "Walk-in Fluida Vetro",
        brand: "Scavolini",
        category: 'Cabine Armadio',
        price: 8800.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/cefcbc41-888a-4e89-a1f7-b80621f45d7c/nuctwf/std/700x0/Walk-in-Fluida_pag_14-15.jpg",
        description: "Prodotto da Scavolini. Eleganza trasparente. Ante telaio alluminio Grigio Antracite con vetro Fumé.",
        initial_material: "Vetro Fumé",
        initial_color: "Vetro Fumé",
        tipologia: "GUARDAROBA"
    },
    { 
        id: 6, 
        title: "Tavolo Manhattan", 
        brand: "Scavolini", 
        category: 'Tavoli', 
        price: 2400.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/8067bd4e-6d7e-496e-bcc1-c5f46dc59462/nuctwf/std/900x0/TAVOLO_MANHATTAN_pag_93.jpg",
        description: "Prodotto da Scavolini. Collezione EveryTime. Tavolo elegante con piano in Laminato Statuario.",
        initial_material: "Marmo",
        initial_color: "Marmo Bianco",
        tipologia: "TAVOLO"
    },
    { 
        id: 17, 
        title: "Tavolo Paris", 
        brand: "Scavolini", 
        category: 'Tavoli', 
        price: 2850.00, 
        imageUrl: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/3ad737ea-7207-49bd-b1f7-25517e4025b2/nuctwf/std/900x0/TAVOLO_PARIS_pag_45.jpg",
        description: "Prodotto da Scavolini. Dotato di Magnum System, meccanismo di estensione fluido e invisibile.",
        initial_material: "Gres",
        initial_color: "Nero",
        tipologia: "TAVOLO"
    },
];

// --- AI LOGIC (ANALISI TESTO & VISIONE) ---
// Ora accetta anche un parametro 'isIterative' per capire se è una modifica successiva
const getAICustomization = async (messages, item, availableProducts = [], isIterative = false) => {
    const productsList = availableProducts.map(p => `${p.title} (di ${p.brand})`).join(", ");
    
    // System Prompt avanzato che gestisce contesto, disambiguazione e priorità
    const systemPrompt = `
SEI: Un Interior Designer AI di alto livello, empatico e versatile di nome Giotto.

---

### 🚨 CONTESTO OBBLIGATORIO (DA NON DIMENTICARE MAI)
L'utente sta visualizzando, chiedendo consigli o modificando ESCLUSIVAMENTE questo oggetto:
- **Nome:** "${item.title}"
- **Brand:** "${item.brand}"
- **Materiale Attuale:** "${item.initial_material}"
- **Colore Attuale:** "${item.initial_color}"
- **Prezzo Base:** ${item.price}€

REGOLA 1: Se l'utente dice "questo", "il mobile", "la cucina" o non specifica il soggetto, si riferisce SEMPRE a "${item.title}". NON chiedere MAI "quale mobile vuoi modificare?".
REGOLA 2: Se l'utente descrive la stanza (es. "ho le pareti blu"), NON modificare il mobile o lo sfondo a meno che non sia una conseguenza logica. Usa quella info solo per dare consigli.

---

### 🧠 REGOLE DI DISAMBIGUAZIONE (CRUCIALE)
Devi distinguere intelligentemente se l'utente parla del **MOBILE** o della **STANZA**, specialmente se usa la stessa parola (es. "Cucina").

1. **QUANDO SI RIFERISCE ALLA STANZA (CONTESTO):**
   - Se l'utente dice: "La **mia** cucina...", "La cucina **ha le pareti**...", "Il **pavimento** della cucina...", "**Nella** cucina c'è...".
   - **AZIONE:** Considera queste informazioni SOLO come vincoli ambientali per darti idee (Es. "Ah, hai pareti blu? Allora ti consiglio il mobile bianco"). **NON modificare l'immagine basandoti su questo.**

2. **QUANDO SI RIFERISCE AL MOBILE (OGGETTO):**
   - Se l'utente dice: "**Questa** cucina...", "**Voglio** la cucina...", "Falla...", "Cambia...", "Il mobile...".
   - **AZIONE:** Questa è una richiesta di modifica. Genera la 'edit_instruction' per cambiare l'aspetto del mobile.

---

### 🚫 REGOLA SUPREMA GENERAZIONE IMMAGINI (IMPORTANTE)
Quando generi la stringa per 'edit_instruction':
1. Descrivi SOLO il mobile e le sue nuove caratteristiche (materiale, colore).
2. **NON descrivere MAI l'ambiente circostante, le pareti o il pavimento.**
   - Esempio ERRATO: "A white kitchen in a room with blue walls". (Questo colorerebbe i muri!)
   - Esempio CORRETTO: "Modern white matte kitchen cabinets, high quality texture".
3. Usa la descrizione della stanza dell'utente (es. "pareti blu") SOLO per decidere il colore del mobile (es. "ti consiglio il bianco"), ma NON scriverlo nella 'edit_instruction'.

---

OBIETTIVO: Capire se il cliente sta chiedendo un CONSIGLIO o facendo una RICHIESTA DIRETTA e agire di conseguenza.
USA SEMPRE LA CRONOLOGIA DELLA CONVERSAZIONE PER RECUPERARE IL CONTESTO.

PROTOCOLLO DI INPUT (COME RICEVI I DATI)
Riceverai sempre una informazione implicita: il MOBILE SELEZIONATO è quello indicato sopra nel contesto.

### 1. ANALISI DELL'INTENTO
Analizza il testo dell'utente per capire cosa vuole:

**CASO A: RICHIESTA DIRETTA (Il cliente sa cosa vuole)**
*Segnali:* Frasi come "Voglio questo in rovere", "Fallo rosso", "Cambia colore in verde", "Mi piace il marmo", "Usa il velluto blu".
*Azione:* NON dare consigli o giudizi di design se non richiesto. Esegui semplicemente la richiesta.

**CASO B: RICHIESTA DI CONSIGLIO / CONTESTO (Il cliente è indeciso o descrive la stanza)**
Nel caso B, oltre al mobile selezionato, come INPUT, PUOI ricevere:
*CONTESTO UTENTE:* Foto o Descrizione della stanza.

### 📸 GESTIONE FOTO CARICATE DALL'UTENTE (CRUCIALE)
Se l'utente carica una foto, quella rappresenta la sua **STANZA ATTUALE** (il contesto "AS-IS").
1.  **INTERPRETAZIONE DELLO SCENARIO:** - **Se nella foto vedi una cucina, un tavolo o un bagno, NON è la "${item.title}". È il vecchio mobile dell'utente che vuole sostituire. Non dire mai "Vedo che hai già la Metropolis o altri modelli di mobili". NON CONFONDERE MAI I MOBILI!
  - **Se la stanza è VUOTA o comunque con pochi mobili:** Considerala una tela bianca. Analizza pavimento, pareti e infissi.
  - **Se la foto è un dettaglio (es. solo un muro colorato, una piastrella, un campione):** L'utente ti sta mostrando un vincolo specifico. NON chiedere "che colore è?". Dillo tu: "Vedo che hai pareti di una tonalità [Colore Rilevato]...".
2. **ANALISI TECNICA:** Guarda la foto e analizza:
   - **Spazio:** La stanza sembra piccola/buia o grande/luminosa?
   - **Palette:** Di che colore sono le pareti? E il pavimento (legno, piastrelle, cotto)?
   - **Accessori:** Ci sono colori d'accento (tende, quadri)?
3. **CONSIGLIO:** Usa questa analisi per proporre come personalizzare la "${item.title}" secondo le regole che ti elencherò di seguito divise per Priorità.
   - Esempio: "Dalla foto vedo che hai un pavimento in cotto scuro e pareti crema. Per la tua nuova ${item.title} ti sconsiglio legni rossicci, meglio un laccato opaco chiaro per dare luce."

---

In questo caso ricorda che NON SEI UN ROBOT CHE ELENCA REGOLE:
Non applicare mai tutte le regole insieme. Agisci come un consulente umano: identifica il "problema principale" della stanza e usa solo la regola che lo risolve meglio.

*PRIORITÀ 1: CORREZIONE SPAZIALE (Se la stanza ha difetti evidenti)*
Attivazione: La stanza è piccola, buia, stretta o bassa.
Strategia: Ignora l'estetica pura, priorità alla luce e allo spazio.
•⁠ ⁠*Piccola/Buia:* Suggerisci TASSATIVAMENTE colori Chiari, Freddi o Bianco per "allontanare" le pareti.
•⁠ ⁠*Soffitto Basso:* Suggerisci mobili bassi e colori chiari.
•⁠ ⁠*Stretta e Lunga:* Se il mobile va sul fondo, scuro (accorcia). Se laterale, chiaro (allarga).

*PRIORITÀ 2: ARMONIZZAZIONE VINCOLI (Se la stanza ha pavimenti/colori difficili)*
Attivazione: Il pavimento ha un colore dominante forte o difficile da abbinare.
Strategia: Usa le regole cromatiche (Fonte: Irene Pea) per bilanciare.
•⁠ ⁠*Pavimento Cotto/Beige/Colori Caldi:* Il nemico è il "troppo calore".
  -> Suggerisci: Verde Salvia, Blu, Rosa Antico, Laccati opachi o Legni scuri. Evita: Rossi/Aranci.
•⁠ ⁠*Parquet Ciliegio/Rossastro:* Il nemico è il "rosso".
  -> Suggerisci: Colori freddi (Grigio, Blu polvere, Verde desaturato) per spegnere il rosso.
•⁠ ⁠*Pavimento Scuro:* Il nemico è il "buio".
  -> Suggerisci: Legni chiari (Rovere sbiancato) o colori luminosi per contrasto.
•⁠ ⁠*Graniglia/Marmo lavorato:* Il nemico è il "caos".
  -> Suggerisci: Tinte unite, laccati opachi, niente venature legno forti.

*PRIORITÀ 3: PSICOLOGIA E FUNZIONE (Se la stanza è neutra/ok)*
Attivazione: La stanza è luminosa, proporzionata e con pavimenti neutri (es. rovere, resina grigia).
Strategia: Focalizzati sull'atmosfera in base al Mobile Selezionato (Fonte: Abitativo).
•⁠ ⁠*Mobile per NOTTE/BAGNO (Letto, Comodino):*
  -> Obiettivo: Relax. Suggerisci: Blu, Verde, Tortora, Legni naturali. Divieto: Rosso acceso.
•⁠ ⁠*Mobile per GIORNO/CUCINA (Tavolo, Parete attrezzata):*
  -> Obiettivo: Convivialità. Suggerisci: Colori caldi, Legni ricchi, Giallo senape, accenti di colore.
•⁠ ⁠*Mobile per STUDIO:*
  -> Obiettivo: Focus. Suggerisci: Verde o toni neutri.

### 3. OUTPUT STRUTTURATO PER L'APP
Devi produrre un JSON che guidi l'applicazione.
CAMPI FONDAMENTALI:
- **reset_to_original**: (Booleano). CRUCIALE. Devi capire se l'utente vuole raffinare l'immagine attuale o provare una variante completamente nuova.
    - Imposta a **TRUE** se l'utente sta cambiando completamente idea, sta chiedendo una variante alternativa che annulla la precedente, o sta ricominciando da zero (es. "Falla bianca" dopo averla fatta rossa, "Meglio in legno", "Non mi piace, cambia", "Fammi vedere l'opzione X").
    - Imposta a **FALSE** se l'utente sta raffinando, aggiungendo dettagli o modificando solo una parte dell'immagine corrente (es. "Fai i pensili bianchi" mantenendo le basi, "Aggiungi una pianta", "Scurisci leggermente").
- **edit_instruction**: (Stringa in INGLESE). Istruzioni per il generatore di immagini.
    - DESCRIVI SOLO IL MOBILE. NON DESCRIVERE LO SFONDO O LA STANZA.
    - Se 'reset_to_original' è TRUE: Descrivi il mobile completo con le nuove specifiche.
    - Se 'reset_to_original' è FALSE: Descrivi SOLO la modifica specifica da applicare all'immagine esistente.
- **new_material**: (Stringa). Materiale principale in italiano.
- **new_color**: (Stringa). Colore principale in italiano.
- **response_text**: (Stringa). Risposta discorsiva per l'utente (Diagnosi + Consiglio + Motivo se è un consiglio, oppure conferma se è richiesta diretta).
`;
    
    const responseSchema = {
        type: "OBJECT",
        properties: {
            "new_material": { "type": "STRING" },
            "new_color": { "type": "STRING" },
            "edit_instruction": { "type": "STRING" },
            "reset_to_original": { "type": "BOOLEAN" },
            "response_text": { "type": "STRING" }
        },
        required: ["response_text", "edit_instruction", "reset_to_original"],
        propertyOrdering: ["new_material", "new_color", "edit_instruction", "reset_to_original", "response_text"]
    };

    const historyParts = messages.map(msg => {
        const parts = [];
        if (msg.text) {
            let textContent = typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text);
            if (msg.role === 'user' && isIterative) {
                 textContent += " [NOTA SISTEMA: L'utente sta guardando un'immagine già modificata. Valuta se vuole resettare o continuare su questa.]";
            }
            parts.push({ text: textContent });
        }
        // MODIFICA CRITICA: Aggiunta del supporto per immagini nella history della chat
        // Ora l'AI può effettivamente "vedere" le foto caricate dall'utente
        if (msg.image) {
             const base64Data = msg.image.split(',')[1];
             parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
        }
        return {
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: parts
        };
    });

    const payload = {
        contents: historyParts,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json", responseSchema: responseSchema }
    };

    let retries = 0;
    while (retries < 3) {
        try {
            const response = await fetch(GEMINI_TEXT_MODEL_URL + apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                const jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```|(\{[\s\S]*?\})/);
                const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : text;
                return JSON.parse(jsonString);
            }
        } catch (error) { retries++; await new Promise(r => setTimeout(r, 1000)); }
    }
    return { response_text: "Non sono riuscito a elaborare la richiesta di design. Riprova.", new_material: "", new_color: "", edit_instruction: "", reset_to_original: false };
};

// --- HELPER FETCH IMAGE CON PROXY FALLBACK (OTTIMIZZATO) ---
const fetchImageWithProxy = async (url) => {
    // 0. Se è già un Data URI (base64), restituiscilo come Blob direttamente
    if (url.startsWith('data:')) {
        const res = await fetch(url);
        return await res.blob();
    }

    // FIX CORS: Usiamo SEMPRE i proxy per le immagini esterne per evitare errori
    // In questo modo il browser non prova nemmeno la connessione diretta che fallirebbe
    const proxies = [
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        // `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}` // Often rate limited
    ];

    for (const proxyUrl of proxies) {
        try {
            const response = await fetch(proxyUrl);
            if (response.ok) {
                const blob = await response.blob();
                if (blob.size > 0) return blob;
            }
        } catch (e) {
            // Silenzioso, passa al prossimo proxy
        }
    }

    throw new Error("Impossibile scaricare l'immagine originale. Riprova con un altro mobile.");
};

// --- GEMINI IMAGE EDITING LOGIC (SEMANTICO & ITERATIVO) ---
const generateModifiedImage = async (currentImageSource, editInstruction) => {
    try {
        // 1. Ottieni il blob dell'immagine
        const imgBlob = await fetchImageWithProxy(currentImageSource);

        // 2. Converti in Base64 pulita
        const base64Image = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(imgBlob);
        });

        // 3. Prompt Costruito Dinamicamente da 'getAICustomization'
        const finalPrompt = `${editInstruction} High quality, photorealistic interior design render. Maintain the perspective and lighting exactly.`;

        const payload = {
            contents: [{
                role: "user",
                parts: [
                    { text: finalPrompt },
                    { inlineData: { mimeType: "image/jpeg", data: base64Image } }
                ]
            }],
            generationConfig: { 
                responseModalities: ["IMAGE"],
                temperature: 0.4 
            }
        };

        const response = await fetch(GEMINI_IMAGE_EDIT_URL + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini Image API Error: ${errText}`);
        }

        const result = await response.json();
        const generatedBase64 = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        
        if (generatedBase64) {
            return `data:image/png;base64,${generatedBase64}`;
        }
        return null;

    } catch (error) {
        console.error("Errore generazione immagine Gemini:", error);
        return null;
    }
};

// --- FUNZIONE RIMOZIONE SFONDO CON GEMINI (AR) ---
const removeBackgroundWithAI = async (imageSrc) => {
    try {
        let base64Image = "";
        if (imageSrc.startsWith("data:")) {
            base64Image = imageSrc.split(",")[1];
        } else {
            const blob = await fetchImageWithProxy(imageSrc);
            base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(blob);
            });
        }

        const prompt = "Isolate the main furniture object in this image. Place it on a pure white background (hex code #FFFFFF). Do NOT crop the object. Keep the object exactly as is, just remove the background.";

        const payload = {
            contents: [{
                role: "user",
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: "image/jpeg", data: base64Image } }
                ]
            }],
            generationConfig: { 
                responseModalities: ["IMAGE"], 
                temperature: 0.2
            }
        };

        const response = await fetch(GEMINI_IMAGE_EDIT_URL + apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Errore API Gemini Background");
        const result = await response.json();
        const generatedBase64 = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
        return generatedBase64 ? `data:image/png;base64,${generatedBase64}` : null;

    } catch (e) {
        console.error("Errore rimozione sfondo:", e);
        return null;
    }
};

const makeWhiteTransparent = (imageSrc) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const threshold = 240; 

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Check if color is close to white
                if (r > threshold && g > threshold && b > threshold) {
                    data[i + 3] = 0; 
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL());
        };
        img.onerror = () => resolve(imageSrc); 
        img.src = imageSrc;
    });
};


// --- COMPONENTS ---

const CameraCaptureOverlay = ({ onCapture, onClose }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                }
            } catch (err) {
                console.error("Camera access error:", err);
                // Usiamo un div al posto di alert() come richiesto dalle istruzioni
                const errorDiv = document.createElement('div');
                errorDiv.innerText = "Impossibile accedere alla fotocamera. Verifica i permessi.";
                errorDiv.className = "fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white p-3 rounded-xl z-[100]";
                document.body.appendChild(errorDiv);
                setTimeout(() => document.body.removeChild(errorDiv), 3000);

                onClose();
            }
        };
        startCamera();
        return () => {};
    }, []);

    const capture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-black">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-10">
                <button onClick={onClose} className="p-2 bg-black/50 text-white rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                <button onClick={capture} className="w-16 h-16 bg-white rounded-full border-4 border-emerald-500 shadow-lg flex items-center justify-center active:scale-95 transition-transform">
                    <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200"></div>
                </button>
            </div>
        </div>
    );
};

const Header = ({ onOpenAbout, onOpenCart, cartCount }) => (
    <header className="absolute top-0 left-0 right-0 z-50"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <div className="flex items-center">
                <LayoutGrid className="w-8 h-8 text-white mr-2" /> 
                <span className="text-3xl font-serif font-light text-white tracking-wider ml-2 hidden sm:inline">
                        DesignGenius<span className="text-emerald-500">AI</span>
                </span>
            </div>
            <div className="flex items-center space-x-6">
                <button onClick={onOpenAbout} className="text-white hover:text-emerald-300 font-medium transition duration-150 tracking-wide">
                    Chi Siamo
                </button>
                <button onClick={onOpenCart} className="relative p-2 text-white hover:text-emerald-300 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-emerald-50 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-neutral-900">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    </header>
);

const CartPage = ({ onClose, cartItems, onRemoveItem }) => {
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    return (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto font-sans">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-xl font-serif text-neutral-900">Il tuo Carrello</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-neutral-500" />
                </button>
            </div>
            <div className="max-w-4xl mx-auto px-6 py-12">
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                            <ShoppingCart className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-medium text-neutral-900">Il carrello è vuoto</h3>
                        <p className="text-neutral-500">Inizia a personalizzare i tuoi arredi per vederli qui.</p>
                        <button onClick={onClose} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">Torna al catalogo</button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {cartItems.map((item) => (
                            <div key={item.cartId} className="flex flex-col md:flex-row gap-6 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-full md:w-48 aspect-square rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-neutral-900">{item.title}</h3>
                                                <p className="text-sm text-emerald-600 font-medium">{item.brand}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-serif text-xl text-neutral-900">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.price)}</p>
                                                {item.isCustomized && (
                                                    <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium inline-block mt-1">Personalizzato</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div className="p-3 bg-neutral-50 rounded-lg">
                                                <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Materiale</span>
                                                <span className="font-medium text-neutral-700">{item.material}</span>
                                            </div>
                                            <div className="p-3 bg-neutral-50 rounded-lg">
                                                <span className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Colore</span>
                                                <span className="font-medium text-neutral-700">{item.color}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <div className="text-xs text-neutral-400">ID: {item.cartId.slice(0, 8)}</div>
                                        <button onClick={() => onRemoveItem(item.cartId)} className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                                            <Trash2 className="w-4 h-4" /> Rimuovi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-neutral-100 pt-8 flex flex-col items-end">
                            <div className="flex justify-between w-full md:w-1/2 mb-2 text-neutral-500">
                                <span>Subtotale ({cartItems.length} articoli)</span>
                                <span>{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(total)}</span>
                            </div>
                            <div className="flex justify-between w-full md:w-1/2 mb-8 text-2xl font-serif text-neutral-900">
                                <span>Totale</span>
                                <span>{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(total)}</span>
                            </div>
                            <button className="w-full md:w-auto px-8 py-4 bg-neutral-900 hover:bg-black text-white rounded-xl font-medium transition-colors shadow-lg">
                                Procedi al Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AboutUsPage = ({ onClose }) => (
    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-serif text-neutral-900">Chi Siamo</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-neutral-500" />
            </button>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">Il Team Dietro l'Innovazione</h1>
                <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                    Dove la creatività italiana incontra l'algoritmo. Siamo ingegneri del futuro, dedicati a rendere il design d'interni un'esperienza accessibile, intuitiva e straordinariamente personale per ognuno di voi.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
               {teamMembers.map((member) => (
                   <div key={member.id} className="group relative w-full max-w-sm cursor-pointer">
                        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100 mb-4 shadow-sm">
                            <img 
                                src={member.image} 
                                alt={member.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"; 
                                }}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-medium text-neutral-900">{member.name}</h3>
                            <p className="text-emerald-600 font-medium text-sm mt-1">{member.role}</p>
                        </div>
                   </div>
               ))}
            </div>
            <div className="text-center pt-20">
                <p className="text-neutral-400 text-sm">DesignGeniusAI © 2025</p>
            </div>
        </div>
    </div>
);

const HowItWorksPage = ({ onClose }) => (
    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex justify-between items-center z-50">
            <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-serif text-neutral-900">Come Funziona</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-neutral-500" />
            </button>
        </div>
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 leading-tight">
                    Dal Catalogo alla Realtà <br/>
                    <span className="text-emerald-500 italic">in 4 Semplici Passi</span>
                </h1>
                <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                    DesignGeniusAI unisce l'intelligenza artificiale alla realtà aumentata per offrirti un'esperienza di arredamento su misura, senza incertezze.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center font-serif text-xl">1</div>
                    <h3 className="text-2xl font-medium text-neutral-900">Scegli il tuo Modello</h3>
                    <p className="text-neutral-500 leading-relaxed">
                        Esplora il nostro catalogo digitale multimarca. Seleziona il mobile di base che ti inspira di più tra le collezioni di Scavolini, Stosa e altri brand premium.
                    </p>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                       <LayoutGrid className="w-8 h-8 text-neutral-400 mb-2" />
                       <span className="text-xs text-neutral-400 uppercase tracking-wider">Catalogo Interattivo</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center font-serif text-xl">2</div>
                    <h3 className="text-2xl font-medium text-neutral-900">Parla con l'AI Designer</h3>
                    <p className="text-neutral-500 leading-relaxed">
                            Carica una foto della stanza o descrivila semplicemente. L'AI è in grado di elaborare qualsiasi tipo di personalizzazione che desideri.
                    </p>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                       <Sparkles className="w-8 h-8 text-emerald-400 mb-2" />
                       <span className="text-xs text-neutral-400 uppercase tracking-wider">Consulenza Intelligente</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center font-serif text-xl">3</div>
                    <h3 className="text-2xl font-medium text-neutral-900">Visualizza l'Anteprima</h3>
                    <p className="text-neutral-500 leading-relaxed">
                        Prima di decidere, vedi il risultato. L'AI genera istantaneamente un'immagine fotorealistica del mobile con le modifiche che hai scelto.
                    </p>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                       <Wand2 className="w-8 h-8 text-purple-400 mb-2" />
                       <span className="text-xs text-neutral-400 uppercase tracking-wider">Generazione Real-Time</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center font-serif text-xl">4</div>
                    <h3 className="text-2xl font-medium text-neutral-900">Provalo a Casa Tua (AR)</h3>
                    <p className="text-neutral-500 leading-relaxed">
                        Il tocco finale. Attiva la Realtà Aumentata per proiettare il mobile 3D direttamente nel tuo salotto, in scala 1:1.
                    </p>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                       <ScanFace className="w-8 h-8 text-blue-400 mb-2" />
                       <span className="text-xs text-neutral-400 uppercase tracking-wider">Realtà Aumentata</span>
                    </div>
                </div>
            </div>
            <div className="text-center pt-12 pb-20">
                <button 
                    onClick={() => {
                        onClose();
                        const catalogSection = document.getElementById('catalog');
                        if (catalogSection) {
                            catalogSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                >
                    Ho capito, Iniziamo! <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

const HeroSection = ({ onOpenHowItWorks }) => (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}>
        <div className="absolute inset-0 bg-black/40"></div> 
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10 flex flex-col justify-center min-h-screen">
            <div className="sm:py-20 mt-[-2rem]"> 
                <h1 className="text-3xl sm:text-6xl font-serif font-light text-white leading-snug mb-6 sm:mb-6"> 
                    Il Tuo Design.
                    <span className="block text-emerald-300"> Nessun Limite.</span> 
                </h1>
                <p className="text-base sm:text-xl text-neutral-200 max-w-2xl mx-auto mb-10 sm:mb-8 font-light">
                    Il mobile come lo vuoi tu. Parla con l'AI, guarda in AR.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#catalog" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-normal rounded-xl shadow-2xl transition duration-300 transform hover:-translate-y-0.5 bg-white text-neutral-900 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 w-full sm:w-auto">
                        Inizia a Personalizzare Ora
                    </a>
                    <button onClick={onOpenHowItWorks} className="inline-flex items-center justify-center px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-normal transition-all backdrop-blur-sm w-full sm:w-auto">
                        Come Funziona
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const CatalogSelector = ({ onSelectFurniture, onAddToCart, onViewAR, cartCount, onOpenCart, scrollToTop }) => {
    const [selectedCategory, setSelectedCategory] = useState('Tutti');
    const filteredItems = useMemo(() => {
        if (selectedCategory === 'Tutti') return catalogItems;
        return catalogItems.filter(i => i.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <section id="catalog" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-8">
                    <div>
                        <h2 className="text-4xl font-serif text-neutral-900 mb-4">La Collezione</h2>
                        <p className="text-neutral-500 font-light max-w-md">Esplora i nostri pezzi iconici selezionati dai migliori brand, pronti per essere personalizzati.</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={scrollToTop} className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors flex items-center gap-2 text-sm font-medium px-4 text-neutral-700">
                            <Home className="w-4 h-4" /> Home
                        </button>
                        <button onClick={onOpenCart} className="p-2 bg-neutral-900 hover:bg-black text-white rounded-full transition-colors flex items-center gap-2 text-sm font-medium px-4 shadow-lg relative">
                            <ShoppingCart className="w-4 h-4" /> Carrello
                            {cartCount > 0 && (
                                <span className="bg-emerald-50 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${selectedCategory === cat ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                        {cat}
                    </button>
                    ))}
                </div>
                
                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item) => (
                        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={item.id} className="group cursor-pointer" onClick={() => onSelectFurniture(item)}>
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 mb-6">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                
                                {/* Overlay buttons */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onViewAR(item); }}
                                        className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all shadow-sm"
                                        title="Vedi originale in AR"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                                        className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-neutral-900 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                        title="Aggiungi originale al carrello"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                    <span className="bg-white/90 backdrop-blur text-neutral-900 px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
                                        <Sparkles className="w-4 h-4 text-emerald-500" /> Personalizza
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-lg font-medium text-neutral-900">{item.title}</h3>
                                    <span className="text-neutral-900 font-serif italic">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.price)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-neutral-500">
                                    <p>{item.category}</p>
                                    <p className="font-medium text-emerald-600">{item.brand}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AROverlay = ({ item, isCustom, onClose, onAddToCart }) => {
    const videoRef = useRef(null);
    const overlayRef = useRef(null); // Riferimento per gli eventi touch/wheel
    const [cameraError, setCameraError] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);
    const [scale, setScale] = useState(0.8); 
    
    // Stato per il pinch-to-zoom
    const [lastTouchDistance, setLastTouchDistance] = useState(null);

    const handleZoom = useCallback((delta) => {
        setScale(prev => Math.max(0.3, Math.min(2.0, prev + delta)));
    }, []);

    // Gestione dello Zoom tramite Scroll (Desktop)
    useEffect(() => {
        const overlayElement = overlayRef.current;
        if (!overlayElement) return;

        const handleWheel = (e) => {
            e.preventDefault();
            // Determinare la direzione dello scroll e applicare un piccolo delta
            const delta = e.deltaY < 0 ? 0.05 : -0.05;
            handleZoom(delta);
        };

        overlayElement.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            overlayElement.removeEventListener('wheel', handleWheel);
        };
    }, [handleZoom]);

    // Gestione dello Zoom tramite Pinch (Mobile)
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            setLastTouchDistance(Math.sqrt(dx * dx + dy * dy));
        }
    };

    const handleTouchMove = (e) => {
        // Impedisce lo scroll della pagina mentre si usa il pinch
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);

            if (lastTouchDistance !== null) {
                const pinchFactor = currentDistance / lastTouchDistance;
                // Calcola il delta basandosi sul fattore di zoom
                const delta = (pinchFactor - 1) * 0.2; 
                handleZoom(delta);
            }
            setLastTouchDistance(currentDistance);
        }
    };

    const handleTouchEnd = () => {
        setLastTouchDistance(null);
    };

    // Applicazione dei gestori di eventi touch al div principale
    useEffect(() => {
        const target = overlayRef.current;
        if (target) {
            target.addEventListener('touchstart', handleTouchStart, { passive: false });
            target.addEventListener('touchmove', handleTouchMove, { passive: false });
            target.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            if (target) {
                target.removeEventListener('touchstart', handleTouchStart);
                target.removeEventListener('touchmove', handleTouchMove);
                target.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [lastTouchDistance, handleZoom]);


    useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
                });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Errore accesso camera:", err);
                setCameraError("Impossibile accedere alla fotocamera. Verifica i permessi del browser.");
            }
        };
        startCamera();

        // --- AR IMAGE PROCESSING WORKFLOW ---
        const prepareARImage = async () => {
            setIsProcessing(true);
            try {
                const imageSource = isCustom ? item.generatedImage : item.imageUrl;
                // 1. Chiediamo a Gemini di rimuovere lo sfondo (bianco puro)
                const whiteBgImage = await removeBackgroundWithAI(imageSource);
                if (whiteBgImage) {
                    // 2. Trasformiamo il bianco in trasparente
                    const transparentImage = await makeWhiteTransparent(whiteBgImage);
                    setProcessedImage(transparentImage);
                } else {
                    // Fallback: usiamo l'immagine originale se AI fallisce
                    setProcessedImage(imageSource);
                }
            } catch (e) {
                console.error("AR Prep Error:", e);
                setProcessedImage(isCustom ? item.generatedImage : item.imageUrl);
            } finally {
                setIsProcessing(false);
            }
        };

        prepareARImage();

        return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, [item, isCustom]);

    

    return (
        <div 
            ref={overlayRef}
            className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center touch-none"
        >
            <div className="absolute inset-0 overflow-hidden bg-neutral-900">
                {cameraError ? (
                    <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <p className="text-lg font-medium mb-2">Fotocamera non disponibile</p>
                        <p className="text-sm text-neutral-400 max-w-md">{cameraError}</p>
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-30 -z-10" />
                    </div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                )}
                
                {isProcessing ? (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        <p className="text-white text-sm font-medium">Ottimizzazione AR in corso...</p>
                        {/* RIMOZIONE DELLA FRASE "Rimozione sfondo e ritaglio" */}
                        {/* <p className="text-neutral-400 text-xs">Rimozione sfondo e ritaglio</p> */}
                    </div>
                ) : (
                    <motion.img 
                        drag 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: scale, opacity: 1 }} // Applica la scala dinamica
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        whileDrag={{ scale: scale * 1.05 }}
                        src={processedImage} 
                        className="absolute top-1/2 left-1/2 w-64 md:w-96 cursor-move drop-shadow-2xl select-none pointer-events-auto" 
                        style={{ x: "-50%", y: "-50%" }}
                    />
                )}
            </div>
            
            <div className="absolute top-4 right-4 z-50">
                <button onClick={onClose} className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur rounded-full text-white transition-colors">
                    <X />
                </button>
            </div>
            
            
            {!isProcessing && (
                <div className="absolute bottom-10 z-50 text-center text-white px-4 w-full">
                    
                    {/* Visualizzazione Scala Attuale - Piccolo indicatore */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-black/40 backdrop-blur-md rounded-full p-2 flex items-center gap-2 border border-white/10 shadow-xl px-4">
                            <Box className="w-5 h-5 text-emerald-300" />
                            <span className="text-sm font-medium text-white">Scala: {(scale * 100).toFixed(0)}%</span>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

const ChatInterface = ({ item, onClose, onAddToCart }) => {
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const [messages, setMessages] = useState([{ 
        role: 'ai', 
        text: `Ciao! Sono Giotto, il tuo Interior Designer AI 🎨. Sono in grado di analizzare la tua stanza: carica una foto o descrivimela per avere consigli di stile. Posso anche generare render fotorealistici basati sulle tue richieste. Cosa aspetti? Trasformiamo insieme "${item.title}"!` 
    }]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isARMode, setIsARMode] = useState(false);
    const [activeARItem, setActiveARItem] = useState(null);
    const [isCameraCaptureOpen, setIsCameraCaptureOpen] = useState(false);
    
    // --- STATE PER L'ITERAZIONE VISIVA ---
    // Conserva l'URL dell'immagine corrente che viene visualizzata e usata come base per le modifiche
    const [currentDisplayImage, setCurrentDisplayImage] = useState(item.imageUrl); // Rimosso l'aggiornamento qui
    const [isIterative, setIsIterative] = useState(false); // Flag per sapere se siamo in un ciclo di modifiche

    const [currentItemState, setCurrentItemState] = useState({
        material: item.initial_material,
        color: item.initial_color,
        title: item.title,
        price: item.price
    });

    const calculateSurcharge = (material, color) => {
        const mat = (material || "").toLowerCase();
        const col = (color || "").toLowerCase();
        const isStandardMat = STANDARD_KEYWORDS.some(k => mat.includes(k));
        const isStandardCol = STANDARD_KEYWORDS.some(k => col.includes(k));
        if (isStandardMat && isStandardCol) return 0;
        return EXTRA_COST;
    };

    useEffect(() => { 
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const convertFileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await convertFileToBase64(e.target.files[0]);
            setSelectedImage(base64);
        }
    };

    const handleCapturePhoto = (dataUrl) => {
        setSelectedImage(dataUrl);
        setIsCameraCaptureOpen(false);
    };

    const handleAddToCartFromChat = (variation) => {
        const cartItem = {
            id: item.id,
            title: item.title,
            brand: item.brand,
            price: variation.price,
            image: variation.image,
            isCustomized: true,
            material: variation.material,
            color: variation.color
        };
        onAddToCart(cartItem);
    };

    const handleViewARFromChat = (variation) => {
        setActiveARItem({
            generatedImage: variation.image,
            imageUrl: item.imageUrl,
            price: variation.price,
            isCustom: true
        });
        setIsARMode(true);
    };

    const handleViewOriginalAR = () => {
        setActiveARItem({
            generatedImage: null,
            imageUrl: item.imageUrl,
            price: item.price,
            isCustom: false
        });
        setIsARMode(true);
    };

    const handleSend = async () => {
        const currentUserInput = input.trim();
        if (!currentUserInput && !selectedImage) return;

        const userText = currentUserInput;
        const userImg = selectedImage;
        const userMsg = { role: 'user', text: userText, image: userImg };
        
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setSelectedImage(null);
        setIsTyping(true);

        try {
            const historyForApi = [...messages, userMsg];
            // 1. Usa Gemini TEXT per capire le intenzioni complesse (multi-colore, prospettiva)
            // Passiamo 'isIterative' per dire al sistema se stiamo modificando un render esistente
            // MODIFICATO: aggiunto 'item' alla chiamata per il contesto
            const analysis = await getAICustomization(historyForApi, item, catalogItems, isIterative);
            
            let newItemState = { ...currentItemState };
            let surcharge = 0;
            let variationData = null;

            // Se c'è un'istruzione di edit (o nuovi materiali), procediamo
            if (analysis.edit_instruction) {
                // Aggiorniamo stato logico
                if (analysis.new_material) newItemState.material = analysis.new_material;
                if (analysis.new_color) newItemState.color = analysis.new_color;
                
                surcharge = calculateSurcharge(newItemState.material, newItemState.color);
                newItemState.price = item.price + surcharge; 
                setCurrentItemState(newItemState);

                // --- LOGICA DI RESET O RIFINITURA ---
                // Se l'AI dice di resettare, usiamo l'immagine originale come base (item.imageUrl).
                // Altrimenti, usiamo l'ultima immagine generata (currentDisplayImage).
                const imageToModify = analysis.reset_to_original ? item.imageUrl : currentDisplayImage;
                
                // 2. Chiamiamo Gemini IMAGE per l'editing semantico
                const newImageUrl = await generateModifiedImage(imageToModify, analysis.edit_instruction);
                
                if (newImageUrl) {
                    // Aggiorniamo l'immagine corrente che SERVE COME BASE PER LE PROSSIME ITERAZIONI
                    // MA NON L'IMMAGINE DI ANTEPRIMA SOPRA LA CHAT.
                    setCurrentDisplayImage(newImageUrl);
                    setIsIterative(true); // Ora siamo in modalità iterativa

                    variationData = {
                        image: newImageUrl,
                        material: newItemState.material,
                        color: newItemState.color,
                        price: newItemState.price,
                        surcharge: surcharge
                    };
                }
            }

            const aiMsg = { 
                role: 'ai', 
                text: analysis.response_text,
                variation: variationData
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'ai', text: "Scusa, ho avuto un problema tecnico. Riprova." }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (isARMode && activeARItem) {
        return (
            <AROverlay 
                item={activeARItem} 
                isCustom={activeARItem.isCustom} 
                onClose={() => setIsARMode(false)}
                // Rimosso onAddToCart dal contesto AR per chiarezza, se necessario va re-implementato nell'AROverlay.
                // In questo caso, lo manteniamo vuoto dato che l'utente ha voluto rimuovere l'UI del carrello dall'AR.
                onAddToCart={() => {}}
            />
        );
    }

    return (
        <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-100 font-sans">
            {isCameraCaptureOpen && (
                <CameraCaptureOverlay 
                    onCapture={handleCapturePhoto} 
                    onClose={() => setIsCameraCaptureOpen(false)} 
                />
            )}
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-emerald-200 shadow-lg">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl text-neutral-900 leading-none">DesignGenius</h3>
                        <p className="text-xs text-neutral-500 mt-1">AI Interior Designer</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleViewOriginalAR} className="p-2 bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-600 rounded-full transition-colors" title="Originale in AR">
                        <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X className="w-5 h-5 text-neutral-500" /></button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50" ref={scrollRef}>
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex gap-4 items-center">
                    {/* MODIFICA APPLICATA QUI: Usa sempre item.imageUrl (originale) per l'anteprima sopra la chat. */}
                    <img src={item.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-neutral-100" />
                    <div>
                        <p className="text-sm text-neutral-500">Stai personalizzando:</p>
                        <p className="font-medium text-neutral-900">{item.title}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-emerald-600 font-bold">{new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.price)}</p>
                            <span className="text-xs text-neutral-400">Base</span>
                        </div>
                    </div>
                </div>

                {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`flex gap-3 max-w-[95%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'ai' ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-200 text-neutral-600'}`}>
                                {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                            </div>
                            <div className={`flex flex-col gap-2 w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-neutral-900 text-white rounded-tr-sm' : 'bg-white border border-neutral-100 rounded-tl-sm text-neutral-700'}`}>
                                    {msg.image && <img src={msg.image} className="w-full h-32 object-cover rounded-lg mb-2" alt="Uploaded context" />}
                                    <p>{typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}</p>
                                </div>
                                {msg.variation && (
                                    <div className="mt-2 w-full bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-md">
                                        <div className="relative aspect-square bg-neutral-100">
                                            <img src={msg.variation.image} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-medium">Proposta AI</div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-baseline mb-3">
                                                <div>
                                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Configurazione</span>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-100 font-medium">{msg.variation.material}</span>
                                                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-100 font-medium">{msg.variation.color}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg text-emerald-600">
                                                        {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(msg.variation.price)}
                                                    </div>
                                                    {msg.variation.surcharge > 0 && (
                                                        <span className="text-[10px] text-orange-500 font-medium">+ €{msg.variation.surcharge} Extra</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                <button onClick={() => handleViewARFromChat(msg.variation)} className="py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors">
                                                    <Box className="w-4 h-4" /> Visualizza in AR
                                                </button>
                                                <button onClick={() => handleAddToCartFromChat(msg.variation)} className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-sm">
                                                    <ShoppingCart className="w-4 h-4" /> Aggiungi al Carrello
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="flex gap-4 items-center ml-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-white border-t border-neutral-100">
                {selectedImage && (
                    <div className="mb-2 relative inline-block">
                           <img src={selectedImage} className="h-16 w-16 object-cover rounded-lg border border-neutral-200" />
                           <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                )}
                <div className="flex gap-2 items-end">
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileSelect} />
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 mb-0.5 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors" title="Carica foto">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsCameraCaptureOpen(true)} className="p-3 mb-0.5 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors" title="Scatta foto">
                        <Camera className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Scrivi un messaggio..." className="w-full min-h-[44px] max-h-32 py-3 bg-neutral-50 border border-neutral-200 rounded-xl pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm resize-none" rows={1} />
                        <button onClick={handleSend} disabled={!input.trim() && !selectedImage} className="absolute right-1 bottom-1.5 h-8 w-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors shadow-sm">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function App() {
    const [selectedFurniture, setSelectedFurniture] = useState(null); 
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false); 
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [catalogARItem, setCatalogARItem] = useState(null);

    const handleSetFurniture = useCallback((item) => { setSelectedFurniture(item); }, []);

    const addToCart = (cartItem) => {
        const newItem = {
            ...cartItem,
            cartId: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        setCart(prev => [...prev, newItem]);
        setIsCartOpen(true); 
    };

    const handleCatalogAddToCart = (item) => {
        addToCart({
            id: item.id,
            title: item.title,
            brand: item.brand,
            price: item.price,
            image: item.imageUrl,
            isCustomized: false,
            material: item.initial_material,
            color: item.initial_color
        });
    };

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans overflow-x-hidden">
            <Header 
                onOpenAbout={() => setIsAboutOpen(true)} 
                onOpenCart={() => setIsCartOpen(true)} 
                cartCount={cart.length}
            />
            <main>
                <HeroSection onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />
                <CatalogSelector 
                    onSelectFurniture={handleSetFurniture} 
                    onAddToCart={handleCatalogAddToCart}
                    onViewAR={setCatalogARItem}
                    cartCount={cart.length}
                    onOpenCart={() => setIsCartOpen(true)}
                    scrollToTop={scrollToTop}
                />
            </main>
            
            <AnimatePresence>
                {isHowItWorksOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsHowItWorksOpen(false)} className="fixed inset-0 bg-black z-50" />
                        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full pointer-events-auto">
                                <HowItWorksPage onClose={() => setIsHowItWorksOpen(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAboutOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsAboutOpen(false)} className="fixed inset-0 bg-black z-50" />
                        <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
                            <div className="w-full h-full pointer-events-auto">
                                <AboutUsPage onClose={() => setIsAboutOpen(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-50" />
                        <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed inset-y-0 right-0 z-[60] w-full md:w-[600px] pointer-events-none flex justify-end">
                            <div className="w-full h-full pointer-events-auto">
                                <CartPage 
                                    onClose={() => setIsCartOpen(false)} 
                                    cartItems={cart}
                                    onRemoveItem={removeFromCart}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedFurniture && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedFurniture(null)} className="fixed inset-0 bg-black z-40" />
                        <ChatInterface 
                            item={selectedFurniture} 
                            onClose={() => setSelectedFurniture(null)} 
                            onAddToCart={addToCart}
                        />
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {catalogARItem && (
                    <AROverlay
                        item={catalogARItem}
                        isCustom={false}
                        onClose={() => setCatalogARItem(null)}
                        onAddToCart={() => {
                            handleCatalogAddToCart(catalogARItem);
                            setCatalogARItem(null);
                        }}
                    />
                )}
            </AnimatePresence>

            <footer className="bg-neutral-800 text-white p-10 text-center text-sm">
                <div className="max-w-7xl mx-auto font-light">
                    <p>&copy; 2025 DesignGeniusAI. Tutti i diritti riservati.</p>
                    <p className="mt-1 text-neutral-400">Design ispirato al lusso minimalista in tonalità smeraldo.</p> 
                </div>
            </footer>
        </div>
    );
};
