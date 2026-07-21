with website_template as (
  select id from public.onboarding_templates where template_key = 'website'
), revised(position, title, guidance, owner, response_type, is_required) as (
  values
    (1, 'Share brand files, photography and content', 'Provide a secure Drive, Dropbox or project-folder link containing logos, brand guidance, original photography, video and available copy.', 'client', 'url', true),
    (2, 'Grant Wix access', 'Invite hello@cnvrtdigital.co.uk as a collaborator with the access needed to review the existing website, content, bookings and settings. Confirm here when sent.', 'client', 'confirmation', true),
    (3, 'Grant domain and DNS access', 'Invite hello@cnvrtdigital.co.uk through the domain provider or share access using a password manager. Never paste passwords here.', 'client', 'confirmation', true),
    (4, 'Grant Analytics and Search Console access', 'Invite hello@cnvrtdigital.co.uk to Google Analytics and Google Search Console with appropriate permissions, then confirm when complete.', 'client', 'confirmation', true),
    (5, 'Grant Google Business Profile access', 'Invite hello@cnvrtdigital.co.uk to the relevant Google Business Profile locations, then confirm when complete.', 'client', 'confirmation', true),
    (6, 'Approve the sitemap and delivery plan', 'CNVRT will add the proposed structure, milestones and review points here when they are ready for your approval.', 'both', 'confirmation', true)
)
update public.onboarding_template_items item
set title = revised.title,
    guidance = revised.guidance,
    owner = revised.owner,
    response_type = revised.response_type,
    is_required = revised.is_required
from website_template, revised
where item.template_id = website_template.id and item.position = revised.position;

with website_projects as (
  select project.id
  from public.projects project
  join public.onboarding_templates template on template.id = project.template_id
  where template.template_key = 'website' and project.status in ('preparing', 'awaiting_client', 'ready')
), revised(position, title, guidance, owner, response_type, is_required) as (
  values
    (1, 'Share brand files, photography and content', 'Provide a secure Drive, Dropbox or project-folder link containing logos, brand guidance, original photography, video and available copy.', 'client', 'url', true),
    (2, 'Grant Wix access', 'Invite hello@cnvrtdigital.co.uk as a collaborator with the access needed to review the existing website, content, bookings and settings. Confirm here when sent.', 'client', 'confirmation', true),
    (3, 'Grant domain and DNS access', 'Invite hello@cnvrtdigital.co.uk through the domain provider or share access using a password manager. Never paste passwords here.', 'client', 'confirmation', true),
    (4, 'Grant Analytics and Search Console access', 'Invite hello@cnvrtdigital.co.uk to Google Analytics and Google Search Console with appropriate permissions, then confirm when complete.', 'client', 'confirmation', true),
    (5, 'Grant Google Business Profile access', 'Invite hello@cnvrtdigital.co.uk to the relevant Google Business Profile locations, then confirm when complete.', 'client', 'confirmation', true),
    (6, 'Approve the sitemap and delivery plan', 'CNVRT will add the proposed structure, milestones and review points here when they are ready for your approval.', 'both', 'confirmation', true)
)
update public.project_onboarding_items item
set title = revised.title,
    guidance = revised.guidance,
    owner = revised.owner,
    response_type = revised.response_type,
    is_required = revised.is_required,
    response_text = null,
    status = 'pending',
    completed_at = null,
    completed_by = null
from website_projects, revised
where item.project_id = website_projects.id and item.position = revised.position;
