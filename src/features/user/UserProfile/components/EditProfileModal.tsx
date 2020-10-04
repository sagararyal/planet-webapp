import React, {useState} from 'react';
import { useSession } from 'next-auth/client';
import Snackbar from '@material-ui/core/Snackbar';
import styles from '../styles/EditProfileModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import BackButton from '../../../../assets/images/icons/BackButton';
import Camera from '../../../../assets/images/icons/userProfileIcons/Camera';
import MaterialTextField from '../../../common/InputTypes/MaterialTextFeild';
import ToggleSwitch from '../../../common/InputTypes/ToggleSwitch';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

export default function EditProfileModal({
  userprofile,
  editProfileModalOpen,
  handleEditProfileModalClose,
}: any) {

  const [savedSnackbarOpen, setSavedSnackbarOpen] = useState(
    false
  );

  const handleSavedSnackbarOpen = () => {
    setSavedSnackbarOpen(true);
  };
  const handleSavedSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSavedSnackbarOpen(false);
  };
  // the form values
  const [firstName, setFirstName] = useState(userprofile.firstname);
  const [lastName, setLastName] = useState(userprofile.lastname);
  const [address, setAddress] = useState(userprofile.address);
  const [city, setCity] = useState(userprofile.city);
  const [zip, setZip] = useState(userprofile.zipCode);
  const [country, setCountry] = useState(userprofile.country);
  const [isPrivateAccount, setIsPrivateAccount] = useState(userprofile.mayPublish);
  const [isSubscribed, setIsSubscribed] = useState(userprofile.mayContact);
  const [description, setDescription] = useState(userprofile.synopsis);
  const [website, setWebsite] = useState(userprofile.url);
  const [ session, loading] = useSession()

  const profilePicStyle = {
    height: '100%',
    width: '100%',
    display: 'flex',
    borderRadius: '200px',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    backgroundImage: 'url(https://img.freepik.com/free-photo/3d-grunge-room-interior-with-spotlight-smoky-atmosphere-background_1048-11333.jpg?size=626&ext=jpg)',
  };

  const saveProfile = async() => {
    const userObject = {
      firstname: firstName,
      lastname: lastName,
      address,
      city,
      zipCode: zip,
      country: country,
      mayPublish: !isPrivateAccount,
      mayContact: isSubscribed,
      synopsis: description,
      url: website
    }
    if (!loading && session && userprofile.id) {
      try{
      console.log('in saved', userObject, session, userprofile.id)
      const res = await fetch(
        `${process.env.API_ENDPOINT}/app/profiles/${userprofile.id}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `OAuth ${session.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userObject)
        },
      );
      if (res.status === 200) {
        handleSavedSnackbarOpen()
        handleEditProfileModalClose()
      }
    } catch {
      //show error toast
      console.log('Error')
    }
    }
  }
  return (
    <React.Fragment>
    <Modal
      className={styles.modalContainer}
      open={editProfileModalOpen}
    //   onClose={handleEditProfileModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={editProfileModalOpen}>
        <div className={styles.modal}>

          <div className={styles.headerDiv}>
            <div className={styles.backDiv} onClick={handleEditProfileModalClose}>
              <BackButton style={{}} />
            </div>
            <div className={styles.editProfileText}>
              {' '}
              <b> Edit Profile </b>
            </div>
          </div>

          <div className={styles.profilePicDiv}>
            <div style={profilePicStyle}>
              <Camera color="white" />
            </div>
          </div>

          <div className={styles.namesDiv}>
            <div className={styles.firstNameDiv}>
              <MaterialTextField 
              onChange={(e)=> setFirstName(e.target.value)}
              label="First Name" 
              variant="outlined" 
              defaultValue={firstName}
              />
            </div>

            <div className={styles.lastNameDiv}>
              <MaterialTextField
              label="Last Name" 
              variant="outlined"
              onChange={(e)=> setLastName(e.target.value)} 
              defaultValue={lastName}
              />
            </div>
          </div>

          <div className={styles.addressDiv}>
            <MaterialTextField 
            onChange={(e)=> setAddress(e.target.value)} 
            defaultValue={address}
            label="Address" 
            variant="outlined" />
          </div>

          <div className={styles.cityZipDiv}>
            <div className={styles.cityDiv}>
              <MaterialTextField 
              onChange={(e)=> setCity(e.target.value)} 
              defaultValue={city}
              label="City" 
              variant="outlined" 
              />
            </div>
            <div className={styles.zipDiv}>
              <MaterialTextField 
              onChange={(e)=> setZip(e.target.value)} 
              defaultValue={zip}
              label="Zip Code" 
              variant="outlined" />
            </div>
          </div>

          <div className={styles.countryDiv}>
            <MaterialTextField 
            onChange={(e)=> setCountry(e.target.value)} 
            defaultValue={country}
            label="Country" 
            variant="outlined" />
          </div>

          <div className={styles.isPrivateAccountDiv}>
            <div>
              <div className={styles.mainText}>Private Account</div>
              <div className={styles.isPrivateAccountText}>
                Your profile is hidden and only your first name appears in the
                leaderboard
              </div>
            </div>
            <ToggleSwitch
              checked={isSubscribed}
              onChange={() => setIsSubscribed(!isSubscribed)}
              name="checkedB"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>

          <div className={styles.isPrivateAccountDiv}>
            <div className={styles.mainText}>Subscribe to news via email</div>

            <ToggleSwitch
              checked={isPrivateAccount}
              onChange={() => setIsPrivateAccount(!isPrivateAccount)}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </div>

          <div className={styles.horizontalLine} />

          <div className={styles.profileDescriptionDiv}>
            <MaterialTextField 
            onChange={(e)=> setDescription(e.target.value)} 
            defaultValue={description}
            label="Profile Desciption" 
            variant="outlined" />
          </div>

          <div className={styles.websiteDiv}>
            <MaterialTextField 
            onChange={(e)=> setWebsite(e.target.value)} 
            defaultValue={website}
            label="Website" 
            variant="outlined" />
          </div>

          <div
            className={styles.saveButton}
            onClick={saveProfile}
          >
            Save
          </div>
        </div>
      </Fade>
    </Modal>
          {/* snackbar for showing "Saved successfully" */}
          <Snackbar
          open={savedSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleSavedSnackbarClose}
        >
          <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={handleSavedSnackbarClose} 
          severity="success" 
          >
            Saved Successfully!
          </MuiAlert>
        </Snackbar>
        </React.Fragment>
  );
}
