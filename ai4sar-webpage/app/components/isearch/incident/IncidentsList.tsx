"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Card, CardBody, CardText, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import {
  collection,
  query,
  onSnapshot,
  where,
  or,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../Firebase-config";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { FaFolder, FaPencilAlt, FaTrash, FaSignOutAlt } from 'react-icons/fa';

// Define types for Incident and IncidentCardProps
interface IncidentData {
  incidentName: string;
  incidentNumber: number;
  incidentDate: string;
  viewableBy?: string[];
  uid?: string;
}

interface Incident {
  id: string;
  data: IncidentData;
}

interface IncidentCardProps {
  incident: Incident;
  inFolder?: boolean;
  onRemoveFromFolder?: (incidentId: string) => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  inFolder,
  onRemoveFromFolder,
}) => {
  const navigate = useRouter();
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => navigate.push(`/incidents/${incident.id}`)}
    >
      <Card>
        <CardBody id="operation-card">
          {inFolder && (
            <Button
              className="return-btn"
              color="primary"
              size="sm"
              style={{
                position: "absolute",
                right: "5px",
                top: "5px",
                zIndex: 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromFolder(incident.id);
              }}
              title="Return to main list"
            >
              <FaSignOutAlt size={12} />
            </Button>
          )}
          <div
            style={{
              padding: "1.3rem 1.3rem",
              height: "5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardText>
              {incident.data.incidentName.length > 24
                ? incident.data.incidentName.substring(0, 24) + "..."
                : incident.data.incidentName}
            </CardText>
          </div>
          <div
            style={{
              background: "#003021",
              color: "white",
              fontSize: "12px",
              padding: "1rem 1rem",
            }}
          >
            <CardText>
              <b>Incident Name:</b>
              <br />
              {incident.data.incidentName}
            </CardText>
            <CardText>
              <b>Incident Number:</b>
              <br />
              {incident.data.incidentNumber}
            </CardText>
            <CardText>
              <b>Incident Date:</b>
              <br />
              {incident.data.incidentDate}
            </CardText>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const FolderCard = ({ folder, incidents, onDelete }) => {
  const initialExpanded = localStorage.getItem(`folder-${folder.id}-expanded`) === 'true';
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isEditing, setIsEditing] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);

  // Get folder incidents and sort them by date
  const folderIncidents = incidents
    .filter(incident => folder.incidentIds.includes(incident.id))
    .sort((a, b) => {
      const dateA = new Date(a.data.incidentDate);
      const dateB = new Date(b.data.incidentDate);
      return dateB.getTime() - dateA.getTime(); // Sort by most recent first
    });

  const toggleExpanded = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    localStorage.setItem(`folder-${folder.id}-expanded`, String(newExpandedState));
  };

  const handleUpdateName = async () => {
    try {
      await updateDoc(doc(db, "folders", folder.id), { name: folderName });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating folder name:", error);
    }
  };

  const handleRemoveFromFolder = async (incidentId) => {
    try {
      await updateDoc(doc(db, "folders", folder.id), {
        incidentIds: folder.incidentIds.filter(id => id !== incidentId)
      });
    } catch (error) {
      console.error("Error removing incident from folder:", error);
    }
  };

  return (
    <Card className="folder-card">
      <CardBody>
        <div className="folder-header" onClick={toggleExpanded}>
          {isEditing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Input
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <Button onClick={(e) => {
                e.stopPropagation();
                handleUpdateName();
              }} outline={false} style={{ border: 'none' }}>
                Submit
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaFolder style={{ marginRight: '0.5rem' }} />
                <b style={{ margin: '0 0.5rem' }}>{folder.name}</b>
                ({folder.incidentIds.length} items)
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={(e) => { 
                  e.stopPropagation();
                  setIsEditing(true);
                }} outline={false} style={{ border: 'none' }}>
                  <FaPencilAlt />
                </Button>
                <Button color="danger" onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder.id);
                }}>
                  <FaTrash />
                </Button>
              </div>
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="folder-content" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            paddingTop: '1rem'
          }}>
            {folderIncidents.map((incident, i) => (
              <IncidentCard 
                key={i} 
                incident={incident}
                inFolder={true}
                onRemoveFromFolder={handleRemoveFromFolder}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const IncidentsList: React.FC = () => {
  const [dropdownOpen, setDropDownOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("Sort by Name ASC");
  const [searchFilter, setSearchFilter] = useState("name");
  const [folders, setFolders] = useState([]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [display, setDisplay] = useState<Incident[]>([]);

  const { currentUser } = useAuth();
  const navigate = useRouter();

  // Add all the sorting functions
  const sortedNamesASC = [...incidents].sort((a, b) =>
    a.data.incidentName.toLowerCase().localeCompare(b.data.incidentName.toLowerCase()),
  );

  const sortedNamesDESC = [...incidents].sort((a, b) =>
    b.data.incidentName.toLowerCase().localeCompare(a.data.incidentName.toLowerCase()),
  );

  const sortedDateLatest = [...incidents].sort((a, b) => {
    let dateA = a.data.incidentDate ? new Date(a.data.incidentDate) : new Date(0);
    let dateB = b.data.incidentDate ? new Date(b.data.incidentDate) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  const sortedDateOldest = [...incidents].sort((a, b) => {
    let dateA = a.data.incidentDate ? new Date(a.data.incidentDate) : new Date(0);
    let dateB = b.data.incidentDate ? new Date(b.data.incidentDate) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  });

  const sortedIncNumASC = [...incidents].sort(
    (a, b) => a.data.incidentNumber - b.data.incidentNumber,
  );

  const sortedIncNumDESC = [...incidents].sort(
    (a, b) => b.data.incidentNumber - a.data.incidentNumber,
  );

  useEffect(() => {
    const fetchAndFixIncidents = async () => {
      try {
        const collRef = collection(db, "incidents");
        const querySnapshot = await getDocs(collRef);
        const batch = writeBatch(db);

        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          if (!data.hasOwnProperty("viewableBy")) {
            const docRef = doc(db, "incidents", docSnapshot.id);
            batch.update(docRef, { viewableBy: [] });
          }
        });

        await batch.commit();
      } catch (error) {
        console.error("Error fetching and fixing incidents: ", error);
      }
    };
    /* REMOVE AFTER MERGE */
    fetchAndFixIncidents();

    const q = query(
      collection(db, "incidents"),
      or(
        where("viewableBy", "array-contains", currentUser.email),
        where("uid", "==", currentUser.uid),
        where("viewableBy", "==", []), // if empty, everyone can see
      ),
    );

    const unsub = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const newIncidents: Incident[] = [];
      querySnapshot.forEach((doc) => {
        const obj: Incident = { id: doc.id, data: doc.data() as IncidentData };
        newIncidents.push(obj);
      });

      setIncidents(newIncidents);

      // Sort by name ascending by default
      const sortedByNameAsc = [...newIncidents].sort((a, b) =>
        a.data.incidentName
          .toLowerCase()
          .localeCompare(b.data.incidentName.toLowerCase()),
      );
      setDisplay(sortedByNameAsc);
    });

    // Add folder listener
    const folderQuery = query(
      collection(db, "folders"),
      where("uid", "==", currentUser.uid),
    );

    const folderUnsub = onSnapshot(folderQuery, (querySnapshot) => {
      const newFolders = [];
      querySnapshot.forEach((doc) => {
        newFolders.push({ id: doc.id, ...doc.data() });
      });
      setFolders(newFolders);
    });

    return () => {
      unsub();
      folderUnsub();
    };
  }, [currentUser]);

  useEffect(() => {
    // Sort by name ascending by default
    const sortedByNameAsc = [...incidents].sort((a, b) =>
      a.data.incidentName
        .toLowerCase()
        .localeCompare(b.data.incidentName.toLowerCase()),
    );
    setDisplay(sortedByNameAsc);
  }, [incidents]);

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      alert("Please enter a folder name");
      return;
    }

    try {
      await addDoc(collection(db, "folders"), {
        name: newFolderName.trim(),
        uid: currentUser.uid,
        incidentIds: [],
        createdAt: serverTimestamp(),
      });
      setNewFolderName("");
      setShowNewFolderModal(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await deleteDoc(doc(db, "folders", folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const filteredIncidents = incidents.filter((incident) =>
    incident.data.incidentName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDragStart = (e, incidentId) => {
    e.dataTransfer.setData("incidentId", incidentId);
  };

  const handleDrop = async (e, folderId) => {
    e.preventDefault();
    const incidentId = e.dataTransfer.getData("incidentId");
    const folder = folders.find((f) => f.id === folderId);

    if (!folder.incidentIds.includes(incidentId)) {
      // Remove from other folders first
      for (const otherFolder of folders) {
        if (otherFolder.incidentIds.includes(incidentId)) {
          await updateDoc(doc(db, "folders", otherFolder.id), {
            incidentIds: otherFolder.incidentIds.filter((id) => id !== incidentId),
          });
        }
      }

      // Add to new folder
      await updateDoc(doc(db, "folders", folderId), {
        incidentIds: [...folder.incidentIds, incidentId],
      });
    }
  };

  return (
    <>
      <div
        className="page-header"
        style={{
          display: "flex",
          marginLeft: "calc(.75rem + 8vw)",
        }}
      >
        <h1 style={{ marginTop: "calc(1.25rem)" }}>Incidents</h1>
      </div>
      <div
        style={{
          display: "flex",
          marginRight: "calc(.75rem + 8vw)",
          marginLeft: "calc(.75rem + 8vw)",
          paddingTop: "1rem",
        }}
      >
        <Input
          bsSize="sm"
          className="form-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search incidents..."
        />
        <Dropdown
          isOpen={dropdownOpen}
          toggle={() => setDropDownOpen(prev => !prev)}
          style={{ marginLeft: "5px" }}
        >
          <DropdownToggle caret>{filter}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                setDisplay(sortedNamesASC);
                setFilter("Sort by Name ASC");
              }}
            >
              Sort by Name ASC
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDisplay(sortedNamesDESC);
                setFilter("Sort by Name DESC");
              }}
            >
              Sort by Name DESC
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDisplay(sortedDateOldest);
                setFilter("Sort by Oldest Date");
              }}
            >
              Sort by Oldest Date
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDisplay(sortedDateLatest);
                setFilter("Sort by Latest Date");
              }}
            >
              Sort by Latest Date
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDisplay(sortedIncNumASC);
                setFilter("Sort by Incident Number ASC");
              }}
            >
              Sort by Incident Number ASC
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDisplay(sortedIncNumDESC);
                setFilter("Sort by Incident Number DESC");
              }}
            >
              Sort by Incident Number DESC
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div style={{ display: "flex", gap: "1rem", marginLeft: "calc(.75rem + 8vw)", marginRight: "calc(.75rem + 8vw)" }}>
        <Button
          onClick={() => navigate.push(`/incidents/creation`)}
          style={{ background: "#006CF5" }}
        >
          Create New Incident
        </Button>
        <Button
          onClick={() => setShowNewFolderModal(true)}
          style={{ background: "#003021" }}
        >
          Create New Folder
        </Button>
      </div>

      {/* Folders Section */}
      <div style={{ marginLeft: "calc(.75rem + 8vw)", marginRight: "calc(.75rem + 8vw)", marginTop: "1rem" }}>
        {folders
          .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
          .map((folder) => (
          <div
            key={folder.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, folder.id)}
          >
            <FolderCard
              folder={folder}
              incidents={incidents}
              onDelete={deleteFolder}
            />
          </div>
        ))}
      </div>

      {/* Unfiled Incidents */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginRight: "calc(.75rem + 7vw)",
          marginLeft: "calc(.75rem + 8vw)",
          paddingTop: "calc(.75rem + 2vw)",
        }}
      >
        {display
          .filter(
            (incident) =>
              incident.data.incidentName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) &&
              !folders.some((folder) => folder.incidentIds.includes(incident.id)),
          )
          .map((incident, i) => (
            <div key={i} draggable onDragStart={(e) => handleDragStart(e, incident.id)}>
              <IncidentCard incident={incident} />
            </div>
          ))}
      </div>

      {/* New Folder Modal */}
      <Modal isOpen={showNewFolderModal} toggle={() => setShowNewFolderModal(false)}>
        <ModalHeader>Create New Folder</ModalHeader>
        <ModalBody>
          <Input
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            required
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={createNewFolder}
            disabled={!newFolderName.trim()}
          >
            Create
          </Button>
          <Button color="secondary" onClick={() => setShowNewFolderModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default IncidentsList;
