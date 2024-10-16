
import React, { useEffect, useState } from 'react';
import { getProducts } from '../../../actions/productaction';
import SideBar from '../SideBar/SideBar';
import { formatDate } from '../../../utils/DateFormat';
import MaterialsGridComponent from './DataGridComponent';
import MaterialsFormDialog from './MaterialsDialogForm';
import AppAppBar from '../../NewHome/components/AppAppBar';

const Main = () => {
    const [materials, setMaterials] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [isAddMaterialsDialogOpen, setIsAddMaterialsDialogOpen] = useState(false);

    const fetchMaterialsData = (materials) => {
        const updatedRows = materials.map((material) => ({
            id: material._id,
            name: material.name,
            description: material.description,
            category: material.category,
            stock: material.stock,
            images: material.images,
            users: material.users || [],
            createdAt: formatDate(material.createdAt),
        }));
        return updatedRows;
    };

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await getProducts();
                // console.log(data);

                if (data.success) {
                    const updatedRows = fetchMaterialsData(data.products);
                    // console.log(updatedRows);
                    setMaterials(updatedRows);
                    setLoading(false);
                } else {
                    console.error('Error fetching data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMaterials();
    }, []);

    const updateMaterials = (newMaterials) => {
        const updatedRows = fetchMaterialsData(newMaterials);
        setMaterials(updatedRows);
    };

    const openAddMaterialDialog = () => {
        setIsAddMaterialsDialogOpen(true);
    };

    return (
        <>
        {/* <AppAppBar />  */}
        <div className='wrapper'>
            <SideBar
                openAddMaterialDialog={openAddMaterialDialog}
            />
            <MaterialsGridComponent 
                materials={materials}
                loading={loading}
                updateMaterials={updateMaterials}
            />
            <MaterialsFormDialog
                isAddMaterialsDialogOpen={isAddMaterialsDialogOpen}
                onClose={() => setIsAddMaterialsDialogOpen(false)}
                updateMaterials={updateMaterials}
            />
        </div>
        </>
    );
};

export default Main;
