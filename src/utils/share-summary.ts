/**---------------------------------------------------------
   * SHARE LISTING VIA SOCIAL NETWORKS
   ----------------------------------------------------------*/
//open/snap bottom sheet to a defined snap point
const handleShareListing = useCallback((id: string) => {
  // const onShare = async () => {
  //   try {
  //     //Option1: The open() method allows a user to share a premade message via a social medium they choose.
  //     //In other words, code specifies the message that will be sent and the user chooses to whom and the social medium through which the message will be sent.
  //     //you can use the react-native Share component but has limited options i.e only message & title
  //     //message and url are  concatenated to form = body of the message
  //     const shareResponse = await Share.open({
  //       message: "Clean 1 bedroom|parking|cctv->url", //Message sent to the share activity
  //       title: "Clean 1 bedroom", //string	//Title sent to the share activity
  //       //url	string	URL you want to share//only support base64 string in iOS & Android
  //       //urls	Array[string]	Array of base64 string you want to share.
  //       //type	string	File mime type
  //       //subject	string	Subject sent when sharing to email
  //       //email	string	Email of addressee
  //       //recipient	string	Phone number of SMS recipient
  //       //showAppsToView	boolean	only android
  //       //filename	string	Only support base64 string in Android
  //       //saveToFiles	boolean	Open only Files app
  //     });
  //     //Option2:
  //     //The shareSingle() method allows a user to share a premade message via a single prechosen social medium.
  //     //In other words, code specifies both the message that will be sent and the social medium through which the message will be sent.
  //     //The user chooses only to whom the message is sent.
  //     // Share.shareSingle({
  //     //   //..all props os .open()
  //     //   title: "Share via",
  //     //   message: "some message",
  //     //   url: "some share url",
  //     //   social: Share.Social.INSTAGRAM_STORIES,, //WHATSAPP|FACEBOOK| FACEBOOK_STORIES|WHATSAPP|WHATSAPPBUSINESS
  //     //   //INSTAGRAM|INSTAGRAM_STORIES|GOOGLEPLUS|EMAIL|PINTEREST|SMS|LINKEDIN|TELEGRAM etc
  //     //  // whatsAppNumber: "9199999999", // country code + phone number//if whatapp
  //     //   filename: "test", // only for base64 file in Android
  //     //   backgroundImage: "http://urlto.png",
  //     //   stickerImage: "data:image/png;base64,<imageInBase64>", //or you can use "data:" link
  //     //   backgroundBottomColor: "#fefefe",
  //     //   backgroundTopColor: "#906df4",
  //     //   attributionURL: "http://deep-link-to-app", //in beta
  //     // });
  //     //console.log(res);
  //   } catch (error: any) {
  //     //*Note that in the case of a user closing the share sheet without sharing, an error will be thrown.
  //     //Alert.alert(error.message);
  //     //err && console.log(err);
  //   }
  // };
  //onShare();
  /** */
}, []);
