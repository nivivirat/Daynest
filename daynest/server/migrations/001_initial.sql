CREATE TABLE daynest_households (
  id text PRIMARY KEY,
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE daynest_inventory (
  household_id text NOT NULL REFERENCES daynest_households(id) ON DELETE CASCADE,
  id text NOT NULL,
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  category text NOT NULL CHECK (category IN ('Produce', 'Dairy & eggs', 'Grains', 'Protein', 'Other')),
  location text NOT NULL CHECK (location IN ('Fridge', 'Pantry', 'Freezer')),
  quantity numeric NOT NULL CHECK (quantity BETWEEN 0 AND 100000),
  unit text NOT NULL CHECK (length(trim(unit)) BETWEEN 1 AND 30),
  low_at numeric NOT NULL CHECK (low_at BETWEEN 0 AND 100000),
  expires date,
  position integer NOT NULL CHECK (position >= 0),
  PRIMARY KEY (household_id, id)
);
CREATE INDEX daynest_inventory_expiry ON daynest_inventory(household_id, expires);

CREATE TABLE daynest_shopping (
  household_id text NOT NULL REFERENCES daynest_households(id) ON DELETE CASCADE,
  id text NOT NULL,
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  checked boolean NOT NULL DEFAULT false,
  position integer NOT NULL CHECK (position >= 0),
  PRIMARY KEY (household_id, id)
);
