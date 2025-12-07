import React from 'react';
import styles from './styles.module.css';
import Button from '@/components/button/button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrevPage: () => void;
    onNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, onPrevPage, onNextPage }) => {
    return (
        <div className={styles.container}>
            {
                totalPages > 1 &&
                <div className={styles.buttons}>
                    <Button text='Anterior' onClick={onPrevPage} disabled={currentPage === 1} />
                    <Button text='Próxima' onClick={onNextPage} disabled={currentPage === totalPages} />
                </div>
            }
            <div className={styles.pagination}>
                {
                    (() => {
                        if (totalPages <= 1) return null; // Não renderiza a paginação se houver apenas uma página ou menos

                        const pagesToShow = [];
                        const startPage = Math.max(2, currentPage - 2);
                        const endPage = Math.min(totalPages - 1, currentPage + 2);

                        pagesToShow.push(1); // Sempre inclui o número da primeira página

                        if (startPage > 2) {
                            pagesToShow.push('ellipsis-before'); // Chave única para as reticências antes das páginas.
                        }

                        for (let i = startPage; i <= endPage; i++) {
                            pagesToShow.push(i);
                        }

                        if (endPage < totalPages - 1) {
                            pagesToShow.push('ellipsis-after'); // Chave única para as reticências depois das páginas.
                        }

                        if (totalPages > 1) {
                            pagesToShow.push(totalPages); // Sempre inclui o número da última página, se houver mais de uma página
                        }

                        return pagesToShow.map((page, index) => {
                            if (page === 'ellipsis-before') {
                                return <span key={'ellipsis-before-' + index} className={styles.ellipsis}>...</span>;
                            } else if (page === 'ellipsis-after') {
                                return <span key={'ellipsis-after-' + index} className={styles.ellipsis}>...</span>;
                            }
                            return (
                                <Button
                                    key={page as number}
                                    text={page.toString()}
                                    onClick={() => onPageChange(page as number)}
                                    disabled={page === currentPage}
                                    className={page === currentPage ? styles.activePage : ''}
                                    invert
                                />
                            );
                        });
                    })()
                }
            </div>
        </div>
    );
};

export default Pagination;