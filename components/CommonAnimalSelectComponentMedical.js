/**
 * @React Imports
 */
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
/**
 * @Expo Imports
 */
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
/**
 * @Redux Imports
 */
import { useDispatch, useSelector } from "react-redux";
/**
 * @Component Imports
 */
import AnimalCustomCard from "./AnimalCustomCard";
import BottomSheetModalComponent from "./BottomSheetModalComponent";
import InsideBottomsheet from "./Move_animal/InsideBottomsheet";
import Card from "./CustomCard";
/**
 * @Third Party Imports
 */
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
/**
 * @Config Imports
 */
import FontSize from "../configs/FontSize";
import Spacing from "../configs/Spacing";
import Loader from "./Loader";
/**
 * @API Imports
 */
import { getSection } from "../services/staffManagement/getEducationType";
import { getParentEnclosure } from "../services/EggsService";
import { postAnimalEnclosure } from "../services/AnimalEnclosureService";
import { getEnclosureBySectionId } from "../services/GetEnclosureBySectionIdServices";
// import { warningDailog } from "../utils/Alert";
import { getAsyncData, saveAsyncData } from "../utils/AsyncStorageHelper";
import { useToast } from "../configs/ToastConfig";
import DialougeModal from "./DialougeModal";
import Config from "../configs/Config";
import { QrGetDetails } from "../services/staffManagement/addPersonalDetails";
import {
  setMedicalAnimal,
  setMedicalEnclosure,
  setMedicalSection,
} from "../redux/MedicalSlice";
import { BackHandler } from "react-native";
import Header from "./Header";

const CommonAnimalSelectComponentMedical = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [type, settype] = useState(props.type);
  const [limit, setlimit] = useState(props.limit);

  const [animalListDataLength, setAnimalListDataLength] = useState([]);
  const [sectionTypeData, setSectionTypeData] = useState([]);
  const [sectionTypeDataLength, setSectionTypeDataLength] = useState([]);
  const [siteDataLength, setSiteDataLength] = useState([]);
  const [enclosureData, setEnclosureData] = useState([]);
  const [selectEnclosureData, setSelectEnclosureData] = useState([]);
  const [selectEnclosureDataLength, setSelectEnclosureDataLength] = useState(
    []
  );
  // const [propscheck,setPropsCheck] = useState(false)

  const [animalData, setAnimalData] = useState([]);
  const [page, setPage] = useState(1);
  const [sectionPage, setSectionPage] = useState(1);
  const [sitePage, setSitePage] = useState(1);
  const [enclosurePage, setEnclosurePage] = useState(1);
  const [animalList, setAnimalList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [prevselect, setPrevselect] = useState(props?.selectedIds ?? []);
  const [selectedPreviousIds, setSelectedPreviousIds] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [selectedEnclosureIds, setSelectedEnclosureIds] = useState([]);
  const [selectedSectionPreviousIds, setSelectedSectionPreviousIds] = useState(
    []
  );
  const [selectedEnclosurePreviousIds, setSelectedEnclosurePreviousIds] =
    useState([]);
  const [searchTextSite, setSearchTextSite] = useState("");
  const [searchTextSection, setSearchTextSection] = useState("");
  const [searchTextAnimal, setSearchTextAnimal] = useState("");
  const [searchTextEnclosure, setSearchTextEnclosure] = useState("");
  const [search, setSearch] = useState(false);
  const [Loading, setLoading] = useState(false);
  const zooID = useSelector((state) => state.UserAuth.zoo_id);
  const site = useSelector((state) => state.UserAuth.zoos);
  const [selectedSite, setSelectedSite] = useState({});
  const [siteData, setSiteData] = useState([]);
  const [selectedSiteNotes, setSelectedSiteNotes] = useState([]);
  const [selectedSiteNotesIds, setSelectedSiteNotesIds] = useState([]);
  const SelectedSiteRedux = useSelector((state) => state.medical.site);

  const [isModalVisible, setModalVisible] = useState(false);
  const [DialougeTitle, setDialougeTitle] = useState("");
  const [ClearType, setClearType] = useState("");
  const [screenName, setScreenName] = useState(props?.screenName ?? "");
  const [allSelectStatus, setAllSelectStatus] = useState(true);
  const [excludeHousingWithNoAnimals, setExcludeHousingWithNoAnimals] =
    useState(props?.excludeHousingWithNoAnimals ?? true);
  const { showToast, errorToast, successToast, warningToast } = useToast();

  const alertModalOpen = () => {
    setModalVisible(true);
  };
  const alertModalClose = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    if (selectedSite?.section_count == 1) {
      getSectionDataPreselected();
    }
  }, [JSON.stringify(selectedSite)]);
  const confirmButtonPress = () => {
    if (ClearType == "section") {
      setAnimalList([]);
      setEnclosureData([]);
      setSectionData([]);
      props.selectAnimalHandler([]);
      props?.enclosurePressed([]);
      props?.sectionPressed([]);
      setModalVisible(false);
    } else if (ClearType == "enclosure") {
      setAnimalList([]);
      setEnclosureData([]);
      props.selectAnimalHandler([]);
      props?.enclosurePressed([]);
      setModalVisible(false);
    } else if (ClearType == "animals") {
      setAnimalList([]);
      props.selectAnimalHandler([]);
      setModalVisible(false);
    }
  };

  const cancelButtonPress = () => {
    alertModalClose();
  };

  const defaultSite =
    site?.length > 0
      ? site[0]?.sites?.length > 0
        ? site[0]?.sites[0]
        : {}
      : {};
  useEffect(() => {
    if (screenName != "Observation") {
      const selectedSite = async () => {
        try {
          const data = await getAsyncData("@antz_selected_site");
          return setSelectedSite(data ?? defaultSite);
        } catch (e) {
          return setSelectedSite({});
        }
      };
      selectedSite();
    }
  }, []);

  const constThemeColor = useSelector((state) => state.darkMode.theme.colors);
  const reduxColors = styles(constThemeColor);
  const selectSiteModalRef = useRef(null);
  const selectSectionModalRef = useRef(null);
  const selectEnclosureModalRef = useRef(null);
  const selectAnimalModalRef = useRef(null);
  const [siteModal, setSiteModal] = useState(false);
  const [sectionModal, setSectionModal] = useState(false);
  const [enclosureModal, setEnclosureModal] = useState(false);
  const [animalModal, setAnimalModal] = useState(false);

  const SelectedAnimalRedux = useSelector((state) => state.medical.animal);
  const SelectedEnclosureRedux = useSelector(
    (state) => state.medical.enclosure
  );

  const SelectedSectionRedux = useSelector((state) => state.medical.section);
  useEffect(() => {
    setSiteData(site.length > 0 ? site[0]?.sites : {});
    if (!selectedSite?.id) {
      if (screenName != "Observation") {
        setSelectedSite(defaultSite);
      }
    }
  }, [JSON.stringify(site[0]?.sites)]);

  //Function for Open BottomSheet
  const handleSelectAnimalModal = () => {
    if (enclosureData?.length == 1) {
      getAllAnimalListById(1, enclosureData[0].enclosure_id, "");
    }
    selectAnimalModalRef.current.present();
    setAnimalModal(true);
    setSearchTextAnimal("");
  };
  const handleSelectSiteModal = () => {
    // getSectionData(1, "");
    selectSiteModalRef.current.present();
    setSiteModal(true);
  };
  const handleSelectSectionModal = () => {
    getSectionData(1, "");
    selectSectionModalRef.current.present();
    setSectionModal(true);
  };

  const handleSelectEnclosureModal = () => {
    if (sectionData?.length == 1) {
      getEnclosureData(1, sectionData[0]?.section_id, "");
    }
    selectEnclosureModalRef.current.present();
    setEnclosureModal(true);
  };
  const countAnimals = (arrayOfObjects) => {
    if (arrayOfObjects?.length > 0) {
      let totalCount = 0;
      arrayOfObjects?.forEach((item) => {
        if (item?.type === "single") {
          totalCount += 1;
        } else if (item?.type === "group") {
          totalCount += parseInt(item?.total_animal);
        }
      });
      return totalCount;
    } else {
      return 0;
    }
  };

  const checkSelectedDatas =
    sectionData?.length > 0 ||
    animalList?.length > 0 ||
    enclosureData?.length > 0;

  // onpress of selected section , enclosure & animal
  const selectAnimalHandler = (animal) => {
    if (selectedIds.includes(animal?.animal_id)) {
      setAnimalList((old) => {
        return old?.filter((v) => v?.animal_id !== animal?.animal_id);
      });
    } else {
      if (animalList?.length < Number(limit)) {
        setAnimalList((old) => {
          return [...old, { ...animal, selectType: "animal" }];
        });
      }
    }
  };
  const SelectAll = () => {
    if (allSelectStatus) {
      if (screenName == "Transfer") {
        const filtered_Animals = animalData?.filter(
          (i) => i?.in_transit != "1" && !prevselect?.includes(i?.animal_id)
        );
        setAnimalList(
          filtered_Animals?.map((item) => {
            return { ...item, selectType: "animal" };
          })
        );
      } else {
        const filtered_Animals = animalData?.filter(
          (i) => !prevselect?.includes(i?.animal_id)
        );

        setAnimalList(
          filtered_Animals?.map((item) => {
            return { ...item, selectType: "animal" };
          })
        );
        setAllSelectStatus(!allSelectStatus);
      }
    } else {
      setAnimalList([]);
      setAllSelectStatus(!allSelectStatus);
    }
  };
  const sectionPressed = (item) => {
    if (screenName == "Transfer" || screenName == "Medical") {
      setSectionData([{ ...item, selectType: "section" }]);
      selectSectionModalRef.current.close();
      setSectionModal(false);
    } else {
      if (selectedSectionIds.includes(item?.section_id)) {
        setSectionData((old) => {
          return old?.filter((v) => v?.section_id !== item?.section_id);
        });
      } else {
        if (sectionData?.length < Number(limit)) {
          setSectionData((old) => {
            return [...old, { ...item, selectType: "section" }];
          });
        }
      }
    }

    props.sectionPressed(item);
  };
  const enclosurePressed = (item) => {
    // After change Encluser need to remove animal data
    if (screenName == "Transfer" || screenName == "Medical") {
      setEnclosureData([{ ...item, selectType: "enclosure" }]);
      selectEnclosureModalRef.current.close();
      setEnclosureModal(false);
    } else {
      if (selectedEnclosureIds.includes(item?.enclosure_id)) {
        setEnclosureData((old) => {
          return old?.filter((v) => v?.enclosure_id !== item?.enclosure_id);
        });
      } else {
        if (enclosureData?.length < Number(limit)) {
          setEnclosureData((old) => {
            return [...old, { ...item, selectType: "enclosure" }];
          });
        }

        // selectAnimalModalRef.current.close();
      }

      props.enclosurePressed(item);
    }
  };

  //Handel Search
  const handleSearch = (text, type) => {
    if (text.length >= 3) {
      const getData = setTimeout(() => {
        if (type == "Site") {
          setSearchTextSite(text);
          setSiteData(
            site[0]?.sites?.filter((p) =>
              p.site_name?.toLowerCase()?.includes(text?.toLowerCase())
            )
          );
        }
        if (type == "medicalSection") {
          setSearchTextSection(text);
          getSectionData(1, text);
        } else if (type == "medicalEnclosure") {
          setSearchTextEnclosure(text);
          getEnclosureData(1, sectionData[0]?.section_id, text);
        } else if (type == "animal") {
          setSearchTextAnimal(text);
          getAllAnimalListById(1, enclosureData[0]?.enclosure_id, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    } else if (text.length == 0) {
      const getData = setTimeout(() => {
        if (type == "Site") {
          setSitePage(1);
          setSearchTextSite("");
          setSiteData(site[0]?.sites);
        }
        if (type == "medicalSection") {
          setSearchTextSection("");
          getSectionData(1, text);
        } else if (type == "medicalEnclosure") {
          setSearchTextEnclosure("");
          getEnclosureData(1, sectionData[0]?.section_id, text);
        } else if (type == "animal") {
          setSearchTextAnimal("");
          getAllAnimalListById(1, enclosureData[0]?.enclosure_id, text);
        }
      }, 2000);
      return () => clearTimeout(getData);
    }
  };

  //Function for close BottomSheet
  const closeSheet = () => {
    selectAnimalModalRef.current.close();
    setAnimalModal(false);
  };
  const closeSiteSheet = () => {
    selectSiteModalRef.current.close();
    setSiteModal(false);
  };
  const closeSectionSheet = () => {
    selectSectionModalRef.current.close();
    setSectionModal(false);
  };
  const closeEnclosureSheet = () => {
    selectEnclosureModalRef.current.close();
    setEnclosureModal(false);
  };

  useEffect(() => {
    setSelectedIds(animalList?.map((v) => v?.animal_id));
    props.selectAnimalHandler(animalList);
  }, [JSON.stringify(animalList)]);

  useEffect(() => {
    setSelectedSectionIds(sectionData.map((v) => v?.section_id));
    props?.sectionPressed(sectionData);
  }, [JSON.stringify(sectionData)]);
  useEffect(() => {
    setSelectedSiteNotesIds(
      selectedSiteNotes.map((v) => v?.site_id?.toString())
    );
    props.setSelectedSites(selectedSiteNotes ?? []);
    // props?.sectionPressed(sectionData);
  }, [JSON.stringify(selectedSiteNotes)]);
  useEffect(() => {
    setSelectedEnclosureIds(enclosureData?.map((v) => v?.enclosure_id));
    props?.enclosurePressed(enclosureData);
  }, [JSON.stringify(enclosureData)]);

  useEffect(() => {
    if (screenName == "Transfer") {
      const prevIds = SelectedAnimalRedux.map((v) => `${v?.animal_id}`);
      setSelectedPreviousIds(prevIds);
    } else {
      const prevIds = SelectedAnimalRedux.map((v) => v?.animal_id);
      setSelectedPreviousIds(prevIds);
    }
  }, [JSON.stringify(SelectedAnimalRedux)]);

  useEffect(() => {
    const prevIds = SelectedSectionRedux.map((v) => v?.section_id);
    setSelectedSectionPreviousIds(prevIds);
  }, [JSON.stringify(SelectedSectionRedux)]);

  useEffect(() => {
    const prevIds = SelectedEnclosureRedux?.map((v) => v?.enclosure_id);
    setSelectedEnclosurePreviousIds(prevIds);
  }, [JSON.stringify(SelectedEnclosureRedux)]);
  //Api Call for Section
  const getSectionDataPreselected = () => {
    setLoading(true);
    var postData = {
      zoo_id: zooID,
      site_id: selectedSite?.site_id,
      other: excludeHousingWithNoAnimals ? "excluded_animal" : "include_all",
      module: screenName,
    };
    if (type) {
      postData.sex =
        type == "mother" ? "female" : type == "father" ? "male" : null;
    }
    getSection(postData)
      .then((res) => {
        if (res.success) {
          if (res?.data?.length > 0) {
            sectionPressed(res.data[0]);
            if (
              res?.data[0]?.enclosure_count == 1 &&
              screenName == "Transfer"
            ) {
              getEnclosureDataPreselected(1, res?.data[0]?.section_id);
            } else {
              setLoading(false);
            }
          }
        }else{
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false);
      }).finally(()=>{
        setLoading(false)
      })
  };

  //Api Call for Section
  const getSectionData = (count, searchText) => {
    setLoading(true);
    var postData = {
      zoo_id: zooID,
      page_no: count,
      site_id:
        selectedSiteNotes?.length > 0
          ? selectedSiteNotes[0]?.site_id
          : selectedSite?.site_id,
      q: searchText,
      other: excludeHousingWithNoAnimals ? "excluded_animal" : "include_all",
      module: screenName,
    };
    if (type) {
      postData.sex =
        type == "mother" ? "female" : type == "father" ? "male" : null;
    }
    setSectionPage(count);
    getSection(postData)
      .then((res) => {
        if (res?.success) {
          if (searchText.length > 0) {
            setSectionTypeDataLength(0);
            setSectionTypeData(res.data);
          } else {
            setSearch(false);
            let dataArr = count == 1 ? [] : sectionTypeData;
            setSectionTypeDataLength(res.data.length);
            if (res.data) {
              setSectionTypeData(dataArr.concat(res.data));
            }
          }
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //Pagination Api Call for Section

  //Pagination Api Call for Section
  const handleLoadMoreSection = () => {
    if (!Loading && sectionTypeDataLength > 0 && !search) {
      const nextPage = sectionPage + 1;
      setSectionPage(nextPage);
      getSectionData(nextPage, "");
    }
  };

  //Api Call for Enclosure
  const getEnclosureDataPreselected = (count, sectionId, searchText) => {
    setLoading(true);

    let postData = {
      section_id: sectionId,
      page_no: count,
      other: excludeHousingWithNoAnimals ? "excluded_animal" : "include_all",
      module: screenName,
    };
    setEnclosurePage(count);
    console?.log({ postData });
    getEnclosureBySectionId(postData)
      .then((res) => {
        if (res.success) {
          enclosurePressed(res?.data?.enclosure_list[0]);
        }
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //Api Call for Enclosure
  const getEnclosureData = (count, sectionId, searchText) => {
    setLoading(true);

    let postData = {
      section_id: sectionId,
      page_no: count,
      q: searchText,
      other: excludeHousingWithNoAnimals ? "excluded_animal" : "include_all",
      module: screenName,
    };
    setEnclosurePage(count);
    getEnclosureBySectionId(postData)
      .then((res) => {
        if (searchText.length > 0) {
          setSelectEnclosureDataLength(0);
          setSelectEnclosureData(res?.data?.enclosure_list);
        } else {
          setSearch(false);
          let dataArr = count == 1 ? [] : selectEnclosureData;
          setSelectEnclosureDataLength(res?.data?.enclosure_list?.length);
          if (res?.data?.enclosure_list?.length > 0) {
            setSelectEnclosureData(dataArr.concat(res.data?.enclosure_list));
            // selectSectionModalRef.current.close();
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //Pagination Api Call for Enclosure
  const handleLoadMoreEnclosure = () => {
    if (!Loading && selectEnclosureDataLength > 0 && !search) {
      const nextPage = enclosurePage + 1;
      setEnclosurePage(nextPage);
      if (sectionData?.length == 1) {
        getEnclosureData(nextPage, sectionData[0]?.section_id, "");
      }
    }
  };

  // Api Call for Animal
  const getAllAnimalListById = (page, selectEnclosureId, searchText) => {
    setLoading(true);

    const obj = {
      enclosure_id: selectEnclosureId,
      page_no: screenName == "Medical" ? null : page, //condition added to turn of pagination for medical screen
      q: searchText,
      module: screenName,
    };
    setPage(page);
    postAnimalEnclosure(obj)
      .then((res) => {
        if (searchText.length > 0) {
          setAnimalListDataLength(0);
          setAnimalData(res.data);
        } else {
          setSearch(false);
          let dataArr = page == 1 ? [] : animalData;
          setAnimalListDataLength(res?.data?.length);
          if (res.data?.length > 0) {
            setAnimalData(dataArr.concat(res.data));
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        // errorToast("Oops!", "Something went wrong!!");
        setLoading(false);
      });
  };

  //Pagination Api Call for Animal
  const handleLoadMore = () => {
    if (screenName !== "Medical") {
      //condition added to turn of pagination for medical screen
      if (!Loading && animalListDataLength > 0 && !search) {
        const nextPage = page + 1;
        setPage(nextPage);
        if (enclosureData?.length == 1) {
          getAllAnimalListById(nextPage, enclosureData[0].enclosure_id, "");
        }
      }
    }
  };

  const clearSelectedId = () => {
    setAnimalList([]);
  };
  const backButton = () => {
    navigation.goBack();
  };
  // const mergeData = (item) => {
  //   setPropsCheck(true)
  //   setSectionData(item?.sectionData);
  //   setEnclosureData(item?.enclosureData);
  //   setAnimalList(item?.animalList);
  // };
  const gotoSearchScreen = () => {
    navigation.navigate("AnimalSearchScreen", {
      selectData: (item) => mergeData(item),
      screenName: props.screenName,
      type: type,
      selectedOption: "qrscan",
      site_id: selectedSite?.site_id ?? "",
    });
  };
  const closeAnimalCard = (id) => {
    const filterData = animalList?.filter((p) => p?.animal_id !== id);
    setAnimalList(filterData);
    props.selectAnimalHandler(filterData);
  };

  const closeSectionCard = (id) => {
    const filterData = sectionData?.filter((p) => p?.section_id !== id);
    setSectionData(filterData);
    if (filterData?.length == 1) {
      getEnclosureData(1, filterData[0]?.section_id, "");
    }
    if (filterData?.length == 0) {
      setAnimalList([]);
      setEnclosureData([]);
    }
  };
  const closeSiteCard = (id) => {
    const filterData = selectedSiteNotes?.filter((p) => p?.site_id !== id);
    setSelectedSiteNotes(filterData);
    setSelectedSiteNotesIds(filterData?.map((v) => v?.site_id?.toString()));
    if (filterData?.length == 0) {
      setAnimalList([]);
      setEnclosureData([]);
      setSectionData([]);
    }
  };
  const closeEnclosureCard = (id) => {
    const filterData = enclosureData?.filter((p) => p?.enclosure_id !== id);
    setEnclosureData(filterData);
    if (filterData?.length == 1) {
      getAllAnimalListById(1, enclosureData[0].enclosure_id, "");
    }
    if (filterData?.length == 0) {
      setAnimalList([]);
    }
  };
  const clearAnimal = () => {
    // warningDailog(
    //   "Sure!!",
    //   "Do you want to clear all?",
    //   "Yes",
    //   () => {
    //     setAnimalList([]);
    //     props.selectAnimalHandler([]);
    //   },
    //   "No"
    // );
    setDialougeTitle("Do you want to clear all?");
    setClearType("animals");
    alertModalOpen();
  };
  const clearEnclosure = () => {
    // warningDailog(
    //   "Sure!!",
    //   "Do you want to clear all?",
    //   "Yes",
    //   () => {
    //     setAnimalList([]);
    //     setEnclosureData([]);
    //     props.selectAnimalHandler([]);
    //     props?.enclosurePressed([]);
    //   },
    //   "No"
    // );
    setDialougeTitle("Do you want to clear all?");
    setClearType("enclosure");
    alertModalOpen();
  };
  const clearSection = () => {
    // warningDailog(
    //   "Sure!!",
    //   "Do you want to clear all?",
    //   "Yes",
    //   () => {
    //     setAnimalList([]);
    //     setEnclosureData([]);
    //     setSectionData([]);
    //     props.selectAnimalHandler([]);
    //     props?.enclosurePressed([]);
    //     props?.sectionPressed([]);
    //   },
    //   "No"
    // );
    setDialougeTitle("Do you want to clear all?");
    setClearType("section");
    alertModalOpen();
  };

  const QrMergeData = (item) => {
    if (item.type == "section") {
      getdetail(item?.type, item?.section_id);
    } else if (item.type == "enclosure") {
      getdetail(item?.type, item?.enclosure_id);
    } else if (item.type == "animal") {
      getdetail(item?.type, item?.animal_id);
    } else {
      errorToast("", "Wrong QR code scanned!!");
    }
  };
  const getdetail = (type, id) => {
    setLoading(true);
    QrGetDetails({ type, id })
      .then((res) => {
        if (res.success == true) {
          setSectionData([]);
          setEnclosureData([]);
          setAnimalList([]);
          if (type == "animal") {
            if (
              res.data.animal_transfered == 1 &&
              props.screenName == "Transfer"
            ) {
              warningToast("Oops!!", "Animal already in transit");
            } else if (
              SelectedAnimalRedux.filter(
                (item) => item.animal_id == res.data.animal_id
              )?.length > 0
            ) {
              warningToast("Oops!!", "Animal already selected");
            } else if (
              SelectedAnimalRedux?.length > 0 &&
              selectedSite.site_id != res.data.site_id
            ) {
              warningToast("Oops!!", "Can't choose animal from different site");
            } else {
              setSectionData([{ ...res.data, selectType: "section" }]);
              setEnclosureData([{ ...res.data, selectType: "enclosure" }]);
              setAnimalList([{ ...res.data, selectType: "animal" }]);
              setSelectedSite({
                site_id: res?.data?.site_id,
                site_name: res?.data?.site_name,
              });
            }
          } else if (type == "enclosure") {
            if (res.data.animal_count == 0 && props.screenName == "Transfer") {
              warningToast(
                "Oops!!",
                "No Animal(s) present in the scanned Enclosure"
              );
            } else {
              setSectionData([{ ...res.data, selectType: "section" }]);
              setEnclosureData([{ ...res.data, selectType: "enclosure" }]);
              setSelectedSite({
                site_id: res?.data?.site_id,
                site_name: res?.data?.site_name,
              });
            }
          } else if (type == "section") {
            if (res.data.animal_count == 0 && props.screenName == "Transfer") {
              warningToast(
                "Oops!!",
                "No Animal(s) present in the scanned Section"
              );
            } else {
              setSectionData([{ ...res.data, selectType: "section" }]);
              setSelectedSite({
                site_id: res?.data?.site_id,
                site_name: res?.data?.site_name,
              });
            }
          }
        } else {
          setLoading(false);
          if (type == "section") {
            warningToast(
              "Oops",
              "User doesn’t have permission for the scanned Section"
            );
          } else if (type == "enclosure") {
            warningToast(
              "Oops",
              "User doesn’t have permission for the scanned  Enclosure"
            );
          } else if (type == "animal") {
            warningToast(
              "Oops",
              "User doesn’t have permission for the scanned Animal"
            );
          } else {
            errorToast("", "Wrong QR code scanneddd!!");
          }
        }
        navigation.goBack();
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const backAction = () => {
      if (siteModal || sectionModal || enclosureModal || animalModal) {
        closeSiteSheet();
        closeEnclosureSheet();
        closeSheet();
        closeSectionSheet();
      } else {
        navigation.goBack();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation, siteModal, sectionModal, enclosureModal, animalModal]);

  return (
    <>
      <Loader visible={Loading} />
      {screenName == "Medical" ? (
        <Header
          onlyBackIcon={true}
          noIcon={true}
          hideMenu={true}
          backgroundColor={constThemeColor?.onPrimary}
          headerPaddingHorizontal={Spacing.small}
        />
      ) : null}

      <View style={reduxColors.container}>
        {screenName != "Transfer" && screenName != "Observation" ? (
          <>
            <View style={reduxColors.textBox}>
              <Text
                style={[
                  reduxColors.textstyle,
                  { paddingHorizontal: 0, paddingBottom: Spacing.body },
                ]}
              >
                Site
              </Text>
              <TouchableOpacity
                disabled={checkSelectedDatas}
                style={[
                  reduxColors.boxStyle,
                  {
                    backgroundColor: selectedSite?.site_name
                      ? constThemeColor?.primary
                      : constThemeColor.surface,
                    borderWidth: selectedSite?.site_name ? 0 : 0.5,
                    borderColor: reduxColors.outline,
                    paddingVertical: Spacing.minor,
                  },
                ]}
                onPress={() => {
                  // if (enclosureData?.length == 0 && animalList?.length == 0) {

                  handleSelectSiteModal();
                  // }
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {selectedSite?.site_name ? (
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="navigation-variant"
                        color={constThemeColor?.onPrimary}
                        size={18}
                      />
                      <Text
                        style={[
                          reduxColors.selectedTextstyle,
                          {
                            color: constThemeColor?.onPrimary,
                            paddingRight: Spacing.minor,
                          },
                        ]}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                      >
                        {selectedSite?.site_name}
                      </Text>
                    </View>
                  ) : (
                    <Text style={reduxColors.selectTextstyle}>Select Site</Text>
                  )}

                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    style={styles.arrowIcon}
                    color={constThemeColor?.onPrimary}
                  />
                </View>
                {/* <View>
            <Card
              title={selectedSite?.site_name}
              style={[
                reduxColors.cardstyle,
                {
                  backgroundColor:
                    enclosureData?.length == 0
                      ? constThemeColor.onPrimary
                      : constThemeColor.background,
                },
              ]}
              svgUri={true}
              rightIcon={
                enclosureData?.length == 0 ? (
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={24}
                    color={constThemeColor.onSurfaceVariant}
                    onPress={() => closeSectionCard(item?.section_id)}
                  />
                ) : null
              }
            />
          </View> */}
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        <View
          style={[
            reduxColors.searchbox,
            {
              marginTop: screenName == "Medical" ? Spacing.body : Spacing.major,
              marginBottom: screenName == "Medical" ? Spacing.body : 0,
            },
          ]}
        >
          <View style={{ width: "100%" }}>
            <TouchableOpacity onPress={gotoSearchScreen}>
              <Searchbar
                mode="bar"
                placeholder="Search Animal"
                editable={true}
                loading={Loading}
                placeholderTextColor={constThemeColor?.onSurfaceVariant}
                style={{
                  width: "100%",
                  backgroundColor: constThemeColor.onSecondary,
                  borderWidth: 1,
                  borderColor: constThemeColor?.outline,
                }}
                inputStyle={{
                  marginLeft: screenName == "Medical" ? -30 : 0,
                }}
                onFocus={gotoSearchScreen}
                icon={(size) =>
                  screenName == "Medical" ? null : (
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color={constThemeColor.onSecondaryContainer}
                    />
                  )
                }
                onIconPress={screenName !== "Medical" ? backButton : undefined}
                onSubmitEditing={() => gotoSearchScreen()}
                right={({ size, color }) => (
                  <View
                    style={[
                      reduxColors.rightIcons,
                      { flexDirection: "row", alignItems: "center" },
                    ]}
                  >
                    <TouchableOpacity
                      style={{
                        padding: Spacing.mini,
                      }}
                      onPress={() =>
                        navigation.navigate("LatestCamScanner", {
                          dataSendBack: QrMergeData,
                          screen: props?.screenName,
                        })
                      }
                    >
                      <MaterialIcons
                        name="qr-code"
                        size={26}
                        color={constThemeColor.primary}
                      />
                    </TouchableOpacity>
                    <MaterialIcons
                      name="search"
                      size={26}
                      style={{
                        margin: Spacing.body,
                        color: constThemeColor.neutralPrimary,
                        padding: Spacing.mini,
                      }}
                      onPress={gotoSearchScreen}
                    />
                  </View>
                )}
              />
            </TouchableOpacity>
          </View>
        </View>

        {selectedSite?.site_name || selectedSiteNotes?.length == 1 ? (
          <View
            style={[
              reduxColors.textBox,
              {
                paddingVertical: Spacing.minor,
                paddingTop: screenName == "Medical" ? 0 : Spacing.minor,
              },
            ]}
          >
            <Text style={reduxColors.textstyle}>
              {screenName == "Transfer" || screenName == "Medical"
                ? "Choose Animal(s)"
                : "Choose Section, Enclosure or Animal"}
            </Text>
          </View>
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={reduxColors.dropdownBox}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {screenName == "Observation" ? (
            <View style={reduxColors.textBox}>
              <Text style={reduxColors.textstyle}>Site</Text>
              <TouchableOpacity
                style={[
                  reduxColors.boxStyle,
                  {
                    backgroundColor:
                      selectedSiteNotes?.length > 0
                        ? constThemeColor?.surfaceVariant
                        : constThemeColor.surface,
                    borderWidth: selectedSiteNotes?.length > 0 ? 0 : 0.5,
                    borderColor: reduxColors.outline,
                  },
                ]}
                onPress={() => {
                  if (
                    sectionData?.length == 0 &&
                    enclosureData?.length == 0 &&
                    animalList?.length == 0
                  ) {
                    handleSelectSiteModal();
                  }
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {selectedSiteNotes?.length > 0 ? (
                    <Text style={reduxColors.selectedTextstyle}>
                      Selected Site
                    </Text>
                  ) : (
                    <Text style={reduxColors.selectTextstyle}>Select Site</Text>
                  )}

                  {selectedSiteNotes?.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedSiteNotes([]);
                        setSelectedSiteNotesIds([]);
                        setAnimalList([]);
                        setSelectedEnclosureIds([]);
                        setSectionData([]);
                        setSelectedSectionIds([]);
                        setEnclosureData([]);
                      }}
                    >
                      <Text style={reduxColors?.clear}>Clear</Text>
                    </TouchableOpacity>
                  ) : (
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={24}
                      style={styles.arrowIcon}
                    />
                  )}
                </View>
                <View>
                  {selectedSiteNotes?.map((item, i) => {
                    return (
                      <Card
                        title={item?.site_name}
                        style={[
                          reduxColors.cardstyle,
                          {
                            backgroundColor:
                              selectedSiteNotes?.length == 0
                                ? constThemeColor.onPrimary
                                : constThemeColor.background,
                          },
                        ]}
                        svgUri={true}
                        rightIcon={
                          // enclosureData?.length == 0 ? (
                          <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                            onPress={() => closeSiteCard(item?.site_id)}
                          />
                          // ) : null
                        }
                      />
                    );
                  })}
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          {selectedSite?.site_name || selectedSiteNotes?.length == 1 ? (
            <TouchableOpacity
              style={[
                reduxColors.boxStyle,
                {
                  backgroundColor:
                    sectionData?.length > 0
                      ? constThemeColor?.surfaceVariant
                      : constThemeColor.surface,
                  borderWidth: sectionData?.length > 0 ? 0 : 0.5,
                  borderColor: reduxColors.outline,
                },
              ]}
              onPress={() => {
                if (enclosureData?.length == 0 && animalList?.length == 0) {
                  handleSelectSectionModal();
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {sectionData?.length > 0 ? (
                  <Text style={reduxColors.selectedTextstyle}>
                    Selected Section
                  </Text>
                ) : (
                  <Text style={reduxColors.selectTextstyle}>
                    Select Section
                  </Text>
                )}

                {sectionData?.length > 0 ? (
                  <TouchableOpacity onPress={clearSection}>
                    <Text style={reduxColors?.clear}>Clear</Text>
                  </TouchableOpacity>
                ) : (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    style={styles.arrowIcon}
                  />
                )}
              </View>
              <View>
                {sectionData?.map((item, i) => {
                  return (
                    <Card
                      title={item?.section_name}
                      style={[
                        reduxColors.cardstyle,
                        {
                          backgroundColor:
                            enclosureData?.length == 0
                              ? constThemeColor.onPrimary
                              : constThemeColor.background,
                        },
                      ]}
                      svgUri={true}
                      rightIcon={
                        enclosureData?.length == 0 ? (
                          <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                            onPress={() => closeSectionCard(item?.section_id)}
                          />
                        ) : null
                      }
                    />
                  );
                })}
              </View>
            </TouchableOpacity>
          ) : null}

          {sectionData?.length == 1 &&
          enclosureData?.length == 0 &&
          !screenName == "Transfer" ? (
            <Text
              style={[
                reduxColors.clearStyle,
                { marginBottom: Spacing.minor, marginLeft: Spacing.mini },
              ]}
            >
              All enclosures under this section will be added. Or you can select
              specific enclosures from below.
            </Text>
          ) : null}

          {sectionData?.length == 1 ? (
            <TouchableOpacity
              style={[
                reduxColors.boxStyle,
                {
                  backgroundColor:
                    enclosureData?.length > 0
                      ? constThemeColor?.surfaceVariant
                      : constThemeColor.surface,
                  borderWidth: enclosureData?.length > 0 ? 0 : 0.5,
                  borderColor: reduxColors.outline,
                },
              ]}
              onPress={() => {
                if (animalList?.length == 0) {
                  handleSelectEnclosureModal();
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {enclosureData?.length > 0 ? (
                  <Text style={reduxColors.selectedTextstyle}>
                    Selected Enclosure
                  </Text>
                ) : (
                  <Text style={reduxColors.selectTextstyle}>
                    Select Enclosure
                  </Text>
                )}
                {enclosureData?.length > 0 ? (
                  <TouchableOpacity onPress={clearEnclosure}>
                    <Text style={reduxColors?.clear}>Clear</Text>
                  </TouchableOpacity>
                ) : (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    style={styles.arrowIcon}
                  />
                )}
              </View>
              <View>
                {enclosureData?.map((item, index) => {
                  return (
                    <Card
                      title={item?.user_enclosure_name}
                      style={[
                        reduxColors.cardstyle,
                        {
                          backgroundColor:
                            animalList?.length == 0
                              ? constThemeColor.onPrimary
                              : constThemeColor.background,
                        },
                      ]}
                      svgUri={true}
                      rightIcon={
                        animalList?.length == 0 ? (
                          <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={24}
                            color={constThemeColor.onSurfaceVariant}
                            onPress={() =>
                              closeEnclosureCard(item?.enclosure_id)
                            }
                          />
                        ) : null
                      }
                    />
                  );
                })}
              </View>
            </TouchableOpacity>
          ) : null}
          {enclosureData?.length == 1 &&
          animalList?.length == 0 &&
          !props.route?.params?.screenName == "Transfer" ? (
            <Text
              style={[
                reduxColors.clearStyle,
                { marginBottom: Spacing.minor, marginLeft: Spacing.mini },
              ]}
            >
              All animals under this enclosure will be added. Or you can select
              specific animals from below.
            </Text>
          ) : null}
          {enclosureData?.length == 1 ? (
            <TouchableOpacity
              style={[
                reduxColors.boxStyle,
                {
                  backgroundColor:
                    animalList?.length > 0
                      ? constThemeColor?.surfaceVariant
                      : constThemeColor.surface,
                  borderWidth: animalList?.length > 0 ? 0 : 0.5,
                  borderColor: reduxColors.outline,
                },
              ]}
              onPress={() => {
                handleSelectAnimalModal();
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {animalList?.length > 0 ? (
                  <Text style={reduxColors.selectedTextstyle}>
                    {countAnimals(animalList)} Selected{" "}
                    {animalList?.length == 1 ? "Animal" : "Animals"}
                  </Text>
                ) : (
                  <Text style={reduxColors.selectTextstyle}>Select Animal</Text>
                )}

                {animalList?.length > 0 ? (
                  <TouchableOpacity onPress={clearAnimal}>
                    <Text style={reduxColors?.clear}>Clear</Text>
                  </TouchableOpacity>
                ) : (
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    style={styles.arrowIcon}
                  />
                )}
              </View>
              <View>
                {animalList?.map((item) => {
                  return (
                    <AnimalCustomCard
                      item={item}
                      animalIdentifier={
                        !item?.local_identifier_value
                          ? item?.animal_id
                          : item?.local_identifier_name ?? null
                      }
                      localID={item?.local_identifier_value ?? null}
                      icon={item?.default_icon}
                      enclosureName={item?.user_enclosure_name}
                      animalName={
                        item?.common_name
                          ? item?.common_name
                          : item?.scientific_name
                      }
                      siteName={item?.site_name}
                      sectionName={item?.section_name}
                      show_specie_details={true}
                      show_housing_details={true}
                      chips={item?.sex}
                      onPress={() => handleSelectAnimalModal()}
                      style={{
                        backgroundColor: selectedIds?.includes(item?.animal_id)
                          ? constThemeColor.onPrimary
                          : null,
                        marginTop: Spacing.small,
                        paddingRight: Spacing.minor + Spacing.mini,
                      }}
                      noArrow={true}
                      rightIcon={
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={24}
                          color={constThemeColor.onSurfaceVariant}
                          onPress={() => closeAnimalCard(item?.animal_id)}
                        />
                      }
                    />
                  );
                })}
              </View>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>

      <BottomSheetModalComponent
        // style={{ marginHorizontal: Spacing.body }}
        ref={selectSiteModalRef}
      >
        <InsideBottomsheet
          screenName={screenName}
          title="Select Site"
          type="Site"
          onPress={(item) => {
            if (screenName == "Observation") {
              if (
                !props?.siteSelectedIds?.includes(item?.site_id?.toString()) &&
                !selectedSiteNotesIds?.includes(item?.site_id?.toString())
              ) {
                setSelectedSiteNotes(
                  selectedSiteNotes?.concat([{ ...item, selectType: "site" }])
                );
              }
            } else {
              setSelectedSite(item);
              closeSiteSheet();
              setSectionTypeData([]);
              saveAsyncData("@antz_selected_site", item);
            }
          }}
          data={siteData}
          // handleLoadMore={handleLoadMoreSite}
          handelSearch={handleSearch}
          searchText={searchTextSite}
          selectedIds={
            screenName == "Observation"
              ? selectedSiteNotesIds
              : selectedSite?.site_id
          }
          closeSectionSheet={closeSiteSheet}
          selectedSiteNotes={selectedSiteNotes}
          selectedSitePreviousIds={props?.siteSelectedIds}
          clearSiteAllSElected={() => setSelectedSiteNotes([])}
          loading={Loading}
        />
      </BottomSheetModalComponent>
      <BottomSheetModalComponent
        // style={{ marginHorizontal: Spacing.body }}
        ref={selectSectionModalRef}
      >
        <InsideBottomsheet
          title="Select Section"
          type="medicalSection"
          onPress={(item) => sectionPressed(item)}
          data={sectionTypeData}
          handleLoadMore={handleLoadMoreSection}
          handelSearch={handleSearch}
          searchText={searchTextSection}
          selectedIds={selectedSectionIds}
          selectedSection={sectionData}
          selectedSectionPreviousIds={selectedSectionPreviousIds}
          closeSectionSheet={closeSectionSheet}
          clearSelectedId={() => setSectionData([])}
          siteName={
            selectedSiteNotes?.length > 0
              ? selectedSiteNotes[0]?.site_name
              : selectedSite?.site_name
              ? selectedSite?.site_name
              : site[0]?.sites[0]?.site_name ?? ""
          }
          loading={Loading}
        />
      </BottomSheetModalComponent>

      <BottomSheetModalComponent
        // style={{ marginHorizontal: Spacing.body }}
        ref={selectEnclosureModalRef}
      >
        <InsideBottomsheet
          title="Select Enclosure"
          type="medicalEnclosure"
          onPress={(item) => enclosurePressed(item)}
          selectEnclosureData={selectEnclosureData}
          handleLoadMore={handleLoadMoreEnclosure}
          handelSearch={handleSearch}
          searchText={searchTextEnclosure}
          selectedIds={selectedEnclosureIds}
          selectedEnclosure={enclosureData}
          closeEnclosureSheet={closeEnclosureSheet}
          selectedEnclosurePreviousIds={selectedEnclosurePreviousIds}
          clearSelectedId={() => setEnclosureData([])}
          sectionName={
            sectionData?.length > 0 ? sectionData[0]?.section_name : ""
          }
          siteName={
            selectedSiteNotes?.length > 0
              ? selectedSiteNotes[0]?.site_name
              : selectedSite?.site_name
              ? selectedSite?.site_name
              : site[0]?.sites[0]?.site_name ?? ""
          }
          loading={Loading}
        />
      </BottomSheetModalComponent>

      <BottomSheetModalComponent
        // style={{ marginHorizontal: Spacing.body }}
        ref={selectAnimalModalRef}
      >
        <InsideBottomsheet
          title="Select Animal"
          type="animal"
          onPress={(item) => {
            selectAnimalHandler(item);
          }}
          data={animalData}
          SelectAll={SelectAll}
          enclosure
          head="animal"
          seletedAnimals={animalList}
          handleLoadMore={handleLoadMore}
          selectedIds={selectedIds}
          closeSheet={closeSheet}
          searchText={searchTextAnimal}
          handelSearch={handleSearch}
          clearSelectedId={clearSelectedId}
          screenName={screenName}
          enclosureName={
            enclosureData?.length > 0
              ? enclosureData[0]?.user_enclosure_name
              : ""
          }
          sectionName={
            sectionData?.length > 0 ? sectionData[0]?.section_name : ""
          }
          siteName={
            selectedSite?.site_name
              ? selectedSite?.site_name
              : site[0]?.sites[0]?.site_name ?? ""
          }
          selectedPreviousIds={selectedPreviousIds}
          loading={Loading}
        />
      </BottomSheetModalComponent>

      <DialougeModal
        isVisible={isModalVisible}
        alertType={Config.ERROR_TYPE}
        title={DialougeTitle}
        closeModal={alertModalClose}
        firstButtonHandle={confirmButtonPress}
        secondButtonHandle={cancelButtonPress}
        firstButtonText={"Yes"}
        secondButtonText={"No"}
        firstButtonStyle={{
          backgroundColor: constThemeColor.error,
          borderWidth: 0,
        }}
        firstButtonTextStyle={{ color: constThemeColor.onPrimary }}
        secondButtonStyle={{
          backgroundColor: constThemeColor.surfaceVariant,
          borderWidth: 0,
        }}
      />
    </>
  );
};

export default CommonAnimalSelectComponentMedical;

const styles = (reduxColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: reduxColors.onPrimary,
      paddingHorizontal: Spacing.minor,
      width: "100%",
    },
    searchbox: {
      marginTop: Spacing.major,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },

    title: {
      fontSize: widthPercentageToDP(4.8),
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSurfaceVariant,
      width: "100%",
    },
    clear: {
      color: reduxColors?.onErrorContainer,
      fontSize: FontSize.Antz_Body_Regular.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      marginRight: Spacing.small,
      paddingVertical: Spacing.mini,
    },

    textBox: {
      marginVertical: Spacing.small,
      alignItems: "flex-start",
      width: "100%",
      marginBottom: 0,
    },

    textstyle: {
      fontSize: FontSize.Antz_Minor_Medium.fontSize,
      fontWeight: FontSize.Antz_Minor_Medium.fontWeight,
      color: reduxColors.onSecondaryContainer,
    },
    dropdownBox: {
      // marginTop: heightPercentageToDP(2),
      width: "100%",
    },

    placehStyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "center",
    },
    boxStyle: {
      width: "100%",
      // borderWidth: 1,
      // borderColor: reduxColors.outlineVariant,
      borderRadius: Spacing.mini,
      paddingHorizontal: Spacing.small,
      paddingVertical: Spacing.body,
      marginBottom: Spacing.body,
    },

    selectTextstyle: {
      fontSize: FontSize.Antz_Minor_Regular.fontSize,
      fontWeight: FontSize.Antz_Minor_Regular.fontWeight,
      textAlign: "left",
      color: reduxColors?.onSecondaryContainer,
      marginLeft: Spacing.small,
    },
    selectedTextstyle: {
      fontSize: FontSize.Antz_Body_Medium.fontSize,
      fontWeight: FontSize.Antz_Body_Medium.fontWeight,
      textAlign: "left",
      color: reduxColors?.neutralPrimary,
      marginLeft: Spacing.small,
    },
    cardstyle: {
      borderRadius: Spacing.small,
      borderWidth: 1,
      borderColor: reduxColors?.outlineVariant,
      flexDirection: "row",
      paddingHorizontal: Spacing.body,
      paddingVertical: Spacing.body,
      alignSelf: "center",
      // marginTop: Spacing.small,
    },
    //modal search box
    clearStyle: {
      fontSize: FontSize.Antz_Body_Regular?.fontSize,
      fontWeight: FontSize.Antz_Body_Regular.fontWeight,
      color: reduxColors?.tertiary,
    },
    arrowIcon: {},
  });
