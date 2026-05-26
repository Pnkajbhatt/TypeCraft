
CREATE TABLE professions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profession_id UUID NOT NULL REFERENCES professions(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE paragraphs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    profession_id UUID NOT NULL REFERENCES professions(id),
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_paragraphs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    paragraph_id UUID NOT NULL REFERENCES paragraphs(id),
    user_id UUID NOT NULL REFERENCES users(id),
    seen_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    paragraph_id UUID NOT NULL REFERENCES paragraphs(id),
    wpm NUMERIC(5,2) NOT NULL,
    accuracy NUMERIC(5,2) NOT NULL,
    mistakes INTEGER NOT NULL,
    time_taken INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    paragraph_id UUID NOT NULL REFERENCES paragraphs(id),
    wpm NUMERIC(5,2) NOT NULL,
    accuracy NUMERIC(5,2) NOT NULL,
    mistakes INTEGER NOT NULL,
    time_taken INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO professions (name) VALUES
    ('Normal'),
    ('Doctor'),
    ('Coder'),
    ('Architecture'),
    ('Lawyer')
ON CONFLICT (name) DO NOTHING;