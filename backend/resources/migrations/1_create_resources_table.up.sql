CREATE TABLE resources (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  concern_types TEXT NOT NULL DEFAULT '[]',
  grade_levels TEXT NOT NULL DEFAULT '[]',
  difficulty_level TEXT NOT NULL DEFAULT 'beginner',
  estimated_time TEXT,
  materials_needed TEXT,
  is_customizable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_concern_types ON resources USING GIN ((concern_types::jsonb));
CREATE INDEX idx_resources_tags ON resources USING GIN ((tags::jsonb));
CREATE INDEX idx_resources_grade_levels ON resources USING GIN ((grade_levels::jsonb));
