import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Movie } from '../models';
import { MovieRepository } from '../repositories';

export class MovieController {
  constructor(
    @repository(MovieRepository)
    public movieRepository: MovieRepository,
  ) { }

  @post('/movies')
  @response(200, {
    description: 'Movie model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Movie) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, {
            title: 'NewMovie',
            exclude: ['id'],
          }),
        },
      },
    })
    movie: Omit<Movie, 'id'>,
  ): Promise<Movie> {
    return this.movieRepository.create(movie);
  }

  @get('/movies/count')
  @response(200, {
    description: 'Movie model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Movie) where?: Where<Movie>,
  ): Promise<Count> {
    return this.movieRepository.count(where);
  }

  @get('/movies')
  @response(200, {
    description: 'Array of Movie model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Movie, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Movie) filter?: Filter<Movie>,
  ): Promise<Movie[]> {
    return this.movieRepository.find({ include: ['actors', 'reviews'] });

  }

  @get('search/movies/{term}')
  @response(200, {
    description: 'Array of Movie model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Movie, { includeRelations: true }),
        },
      },
    },
  })
  async searchByName(
    @param.path.string('term') term: string,
  ): Promise<Movie[]> {
    const searchParams = [{ title: { like: term, options: 'i' } }];
    const filterObject = {
      where: { or: searchParams },
      order: ['title ASC'],
      include: ['actors', 'reviews']
    }
    return this.movieRepository.find(filterObject);
  }

  @patch('/movies')
  @response(200, {
    description: 'Movie PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, { partial: true }),
        },
      },
    })
    movie: Movie,
    @param.where(Movie) where?: Where<Movie>,
  ): Promise<Count> {
    return this.movieRepository.updateAll(movie, where);
  }

  @get('/movies/{id}')
  @response(200, {
    description: 'Movie model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Movie, { includeRelations: true }),
        items: getModelSchemaRef(Movie, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,

    @param.filter(Movie) filter?: Filter<Movie>,
  ): Promise<Movie> {
    return this.movieRepository.findById(id, { include: ['reviews', 'actors'] });

  }


  @get('/movies-actors/{id}')
  @response(200, {
    description: 'Movie model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Movie, { includeRelations: true }),
        items: getModelSchemaRef(Movie, { includeRelations: true }),
      },
    },
  })
  async findActorById(
    @param.path.string('id') id: string,

    @param.filter(Movie) filter?: Filter<Movie>,
  ): Promise<Movie> {
    return this.movieRepository.findById(id, { include: ['actors'] });

  }

  @get('/actor-movies/{id}')
  @response(200, {
    description: 'Movie model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Movie, { includeRelations: true }),
        items: getModelSchemaRef(Movie, { includeRelations: true }),
      },
    },
  })
  async findMovieByActorId(
    @param.path.string('id') id: string,

    @param.filter(Movie) filter?: Filter<Movie>,
  ): Promise<Movie> {

    return this.movieRepository.findById(id, { include: ['actors'] });

  }

  @patch('/movies/{id}')
  @response(204, {
    description: 'Movie PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Movie, { partial: true }),
        },
      },
    })
    movie: Movie,
  ): Promise<void> {
    await this.movieRepository.updateById(id, movie);
  }

  @put('/movies/{id}')
  @response(204, {
    description: 'Movie PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() movie: Movie,
  ): Promise<void> {
    await this.movieRepository.replaceById(id, movie);
  }

  @del('/movies/{id}')
  @response(204, {
    description: 'Movie DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<string> {

    
  const checkYearError = "Movies only 1 year older can be deleted"
    const successDelete = "Movie Deleted"
    
    try {

       const movieToDelete = await this.movieRepository.findById(id);
       const checkYear =
       new Date().getFullYear() - movieToDelete.yearReleased >= 1;

       if (!checkYear){
        return checkYearError
       
       }
        else{
          await this.movieRepository.deleteById(id);
          await this.movieRepository.reviews(id).delete()
          return successDelete
        }     
       
    } catch (error) {
      return error
    }
  
  }
}
