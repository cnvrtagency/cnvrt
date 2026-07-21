update public.project_onboarding_items item
set response_text = 'https://drive.google.com/drive/folders/1FPNpgK5i3XOPk0BoWt7VIcMi1YhiRQWT?usp=sharing',
    guidance = 'Upload the original logos, brand files, photography, video and available copy to the CNVRT project folder below. Please use original files rather than images downloaded from the current website.',
    status = 'in_progress'
where item.position = 1
  and item.project_id = (
    select project.id
    from public.projects project
    join public.clients client on client.id = project.client_id
    where client.company_name = 'The Rejuvenation Doctors'
    order by project.created_at desc
    limit 1
  );
