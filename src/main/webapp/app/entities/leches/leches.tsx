// removed th id primary key
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './leches.reducer';
import { ILeches } from 'app/shared/model/leches.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';

import { Bar, Doughnut } from 'react-chartjs-2';
import { CategoryScale, Chart, registerables } from 'chart.js';

export interface ILechesProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Leches = (props: ILechesProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  Chart.register(CategoryScale, ...registerables);

  const { lechesList, match, loading, totalItems } = props;
  return (
    <div className="container-entities">
      <h2 id="leches-heading" data-cy="LechesHeading">
        Leches
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Actualizar lista
          </Button>
          <Link to={`${match.url}/new`} className="btn btn-success jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Nuevo registro
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {lechesList && lechesList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('analisis')}>
                  Análisis <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('calidad')}>
                  Calidad <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('cantidad')}>
                  Cantidad <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('fechaDeIngreso')}>
                  Fecha de ingreso <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('tambo')}>
                  Tambo <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('temperatura')}>
                  Temperatura <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Cisterna <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lechesList.map((leches, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`${match.url}/${leches.id}`} color="link" size="sm">
                      {leches.id}
                    </Button>
                  </td>
                  <td>{leches.analisis}</td>
                  <td>{leches.calidad}</td>
                  <td>{leches.cantidad}</td>
                  <td>
                    {leches.fechaDeIngreso ? <TextFormat type="date" value={leches.fechaDeIngreso} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{leches.tambo}</td>
                  <td>{leches.temperatura}</td>
                  <td>{leches.cisterna ? <Link to={`cisternas/${leches.cisterna.id}`}>{leches.cisterna.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`${match.url}/${leches.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editar</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${leches.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No se encontraron registros</div>
        )}
      </div>
      {props.totalItems ? (
        <div className={lechesList && lechesList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={props.totalItems}
            />
          </Row>
        </div>
      ) : (
        ''
      )}{' '}
      <div style={{ width: '45%', display: 'flex', flexDirection: 'row' }}>
        <Bar
          style={{ marginTop: 45, marginLeft: '15%' }}
          data={{
            labels: lechesList.map(leches => leches.analisis),
            datasets: [
              {
                label: 'Cantidad',
                data: lechesList.map(leches => leches.cantidad),
                backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)'],
                borderWidth: 1,
              },
              {
                label: 'Temperatura',

                data: lechesList.map(leches => leches.temperatura),
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
        <div style={{ marginLeft: '25%' }}>
          <h5 style={{ textAlign: 'center', fontSize: 16, color: '#222' }}>Cisternas</h5>
          <Doughnut
            data={{
              labels: lechesList.map(leches => leches.cisterna.id),
              datasets: [
                {
                  data: lechesList.map(leches => leches.cantidad),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ leches }: IRootState) => ({
  lechesList: leches.entities,
  loading: leches.loading,
  totalItems: leches.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Leches);
