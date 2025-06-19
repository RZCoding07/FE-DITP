import ProfileForm from './profile-form'
import ContentSection from '../components/content-section'

export default function SettingsProfile() {
  return (
<div className='flex flex-1 flex-col space-y-4 rounded-lg border bg-card shadow-sm p-5 md:max-h-[calc(100vh-4rem)] md:overflow-hidden lg:max-h-[calc(100vh-4rem)] lg:overflow-hidden lg:rounded-lg lg:border lg:bg-card lg:p-6'>

      <ContentSection
      title='Profile'
      desc='This is how others will see you on the site.'
    >
      <ProfileForm />
    </ContentSection>

</div>

  )
}
