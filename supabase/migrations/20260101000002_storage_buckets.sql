-- ==============================================================================
-- RESTAURANT ELECTRICAL AUTHORITY (REA) - STORAGE BUCKETS & STORAGE POLICIES
-- Migration: 20260101000002_storage_buckets.sql
-- Description: Secure storage buckets for Documents, Evidence, Certificates & Photos
-- ==============================================================================

-- 1. Create Buckets in storage.buckets table
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('documents', 'documents', false),
    ('evidence', 'evidence', false),
    ('certificates', 'certificates', true),
    ('photos', 'photos', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2. Storage Policies: Documents Bucket
CREATE POLICY "Authorized users can view organization documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Authorized users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
);

-- 3. Storage Policies: Evidence Bucket
CREATE POLICY "Authorized users can view assessment and incident evidence"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'evidence' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Assessors and Managers can upload evidence"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'evidence' AND
    auth.role() = 'authenticated'
);

-- 4. Storage Policies: Certificates Bucket
CREATE POLICY "Certificates are publicly viewable for verification"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "Certification managers can upload certificates"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'certificates' AND
    auth.role() = 'authenticated'
);

-- 5. Storage Policies: Equipment and Panel Photos
CREATE POLICY "Users can view equipment and panel photos"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'photos' AND
    auth.role() = 'authenticated'
);

CREATE POLICY "Users can upload equipment and panel photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'photos' AND
    auth.role() = 'authenticated'
);
