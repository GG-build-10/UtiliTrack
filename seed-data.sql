-- Insert sample data for testing

-- First, let's create a test user if it doesn't exist
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Check if we have a test user
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
  
  -- If no test user exists, create one
  IF test_user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test@example.com',
      '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12',
      NOW(),
      NOW(),
      NOW()
    ) RETURNING id INTO test_user_id;
  END IF;
  
  -- Insert sample bills for the test user
  INSERT INTO public.bills (
    id,
    user_id,
    provider,
    amount,
    bill_date,
    due_date,
    period_start,
    period_end,
    bill_type,
    created_at,
    updated_at
  ) VALUES
  (
    gen_random_uuid(),
    test_user_id,
    'HEP',
    65.99,
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '10 days',
    CURRENT_DATE - INTERVAL '35 days',
    CURRENT_DATE - INTERVAL '5 days',
    'electricity',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    test_user_id,
    'Hrvatske vode',
    32.50,
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE - INTERVAL '40 days',
    CURRENT_DATE - INTERVAL '10 days',
    'water',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    test_user_id,
    'Gradska plinara Zagreb',
    45.75,
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE,
    CURRENT_DATE - INTERVAL '45 days',
    CURRENT_DATE - INTERVAL '15 days',
    'gas',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    test_user_id,
    'Hrvatski Telekom',
    29.99,
    CURRENT_DATE - INTERVAL '20 days',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE - INTERVAL '50 days',
    CURRENT_DATE - INTERVAL '20 days',
    'internet',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    test_user_id,
    'A1',
    25.00,
    CURRENT_DATE - INTERVAL '25 days',
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE - INTERVAL '55 days',
    CURRENT_DATE - INTERVAL '25 days',
    'phone',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    test_user_id,
    'Hrvatska Radiotelevizija',
    10.62,
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE - INTERVAL '15 days',
    CURRENT_DATE - INTERVAL '60 days',
    CURRENT_DATE - INTERVAL '30 days',
    'tv',
    NOW(),
    NOW()
  );
  
  -- Add some bill images (without actual files)
  INSERT INTO public.bill_images (
    id,
    bill_id,
    storage_path,
    created_at
  )
  SELECT
    gen_random_uuid(),
    id,
    'https://placeholder.com/bill-image-' || EXTRACT(EPOCH FROM created_at)::text || '.jpg',
    created_at
  FROM
    public.bills
  WHERE
    user_id = test_user_id;
    
END $$;
