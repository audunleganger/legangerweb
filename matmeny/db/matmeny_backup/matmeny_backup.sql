--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: meals; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.meals (
    date date NOT NULL,
    meal_name text NOT NULL
);


ALTER TABLE public.meals OWNER TO "user";

--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: meals; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.meals (date, meal_name) FROM stdin;
2025-10-31	Pølser og potetstappe
2025-06-16	Bakt potet med mye godt
2025-06-15	Chicken wraps
2025-11-04	Pannekaker
2025-12-01	Pølser og potetstappe
2025-06-19	Biff og pommes frittes
2025-12-02	Pølser og potetstappe
2025-12-03	Pølser og potetstappe
2025-06-21	
2025-06-22	
2025-12-04	Pølser og potetstappe
2025-06-18	Burger
2025-12-05	Pølser og potetstappe
2025-12-13	Julebord m/BS-gjengen
2025-10-29	Gnocchi
2025-12-08	Carbonara
2025-06-17	Chili con carne
2025-06-24	Gresk linsegryte med kjøtt
2025-10-30	Burgertallerken
2025-06-20	Pizza
2025-06-23	Kylling- og kokossuppe, salat og grillet kylling m/surdeigsbrød. Vafler til kveldsmat.
2025-07-01	Lasagne
2025-07-02	Taco
2025-07-03	Grilling på Nesodden
2025-07-04	Rester
2025-10-06	Kalkunrester
2025-10-07	Koteletter med stekte poteter
2025-10-09	Pølser og potetstappe
2025-10-08	Spise ute
2025-10-10	Taco
2025-10-12	Pizza
2025-10-13	Kylling og ris
2025-10-14	Pannekaker
2025-10-15	Torsk
2025-10-16	Biffstrimler med paprika
2025-10-17	Taco
2025-10-19	Kjøttboller og pasta
2025-10-21	Pannekaker
2025-12-09	
2025-10-22	Risonipanne
2025-10-23	Viltgryte
2025-11-01	Ribbe og chips
2025-11-03	Grøt
2025-11-05	Gnocchi med kjøttboller
2025-10-20	Koteletter
2025-11-06	Ramen
2025-10-26	Kyllinggryte m/ris og kokos
2025-11-02	Lasagne
2025-10-24	Rester
2025-10-25	Fries
2025-11-11	BURSDAG!
2025-12-10	
2025-11-08	
2025-10-27	Thaicurry m/skrei og blomkål
2025-11-07	
2025-11-09	Taco
2025-12-11	
2025-12-07	Taco
2025-11-10	Thaicurry m/skrei og blomkål
2025-12-14	Chicken korma
2025-10-28	Pannekaker
2025-11-17	Fisketaco
2025-11-14	Carbonara
2025-11-23	Grøt
2025-11-12	
2025-11-13	Butter chicken m/naan
2025-11-15	Kyllingcurry
2025-11-16	Bursdagsmiddag
2025-11-25	Arepas
2025-11-20	
2025-11-19	Tomatsuppe og ostesmørbrød
2025-11-18	
2025-11-21	
2025-11-22	Kyllingsuppe
2025-11-24	Pestopasta
2025-11-27	Korma m/naan
2025-11-28	
2025-11-30	Familiejulemiddag
2025-11-29	Kreativ øvelse
2025-11-26	Bibimbap
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, username, password_hash, created_at) FROM stdin;
1	audun	$2b$10$xfUcl82Oevo6GPbljjNtkOmZxP3MyvnYVEqB/FAqzImmGoAGNq9QG	2025-06-15 16:41:00.210432
2	cristina	$2b$10$xfUcl82Oevo6GPbljjNtkOmZxP3MyvnYVEqB/FAqzImmGoAGNq9QG	2025-06-15 16:41:00.210432
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: meals meals_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.meals
    ADD CONSTRAINT meals_pkey PRIMARY KEY (date);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

