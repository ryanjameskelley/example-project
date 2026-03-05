import {
  ContactsDialogRoot,
  ContactsDialogContent,
  ContactsDialogNav,
  ContactsDialogContentArea,
} from '@/components/organisms/ContactsDialog';

export function PatientVitals() {
  return (
    <ContactsDialogRoot open={true} onOpenChange={() => {}}>
      <ContactsDialogContent>
        <ContactsDialogNav />
        <ContactsDialogContentArea />
      </ContactsDialogContent>
    </ContactsDialogRoot>
  );
}
